import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LoginDto } from './dto/login.dto';

const MAX_FAILED_ATTEMPTS = 5;
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_DAYS = 7;
const RESET_TOKEN_TTL_MINUTES = 30;

function hashToken(token: string): string {
  // Los refresh/reset tokens se almacenan solo como hash (nunca en texto plano), igual que la contraseña.
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {}

  async login(dto: LoginDto, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    // Mensaje genérico en ambos casos (usuario inexistente o contraseña incorrecta)
    // para no revelar si un correo existe en el sistema.
    const genericError = new UnauthorizedException('Credenciales inválidas.');

    if (!user || user.status !== 'ACTIVE') {
      await this.auditService.record({
        action: 'LOGIN_FAILED',
        metadata: { email: dto.email, reason: 'usuario_no_encontrado_o_inactivo' },
        ipAddress,
      });
      throw genericError;
    }

    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      await this.auditService.record({
        actorUserId: user.id,
        action: 'LOGIN_BLOCKED',
        ipAddress,
      });
      throw new ForbiddenException(
        'Cuenta bloqueada por intentos fallidos. Contacte al administrador.',
      );
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: { increment: 1 } },
      });
      await this.auditService.record({
        actorUserId: user.id,
        action: 'LOGIN_FAILED',
        ipAddress,
      });
      throw genericError;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lastLoginAt: new Date() },
    });

    const tokens = await this.issueTokens(user.id, user.email, user.role.code);

    await this.auditService.record({
      actorUserId: user.id,
      action: 'LOGIN_SUCCESS',
      ipAddress,
    });

    return {
      ...tokens,
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.code,
      },
    };
  }

  async refresh(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { role: true } } },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Sesión inválida o expirada. Inicie sesión nuevamente.');
    }

    // Rotación: el refresh token usado se revoca y se emite uno nuevo.
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(stored.user.id, stored.user.email, stored.user.role.code);
  }

  async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Respuesta idéntica exista o no el usuario, para no filtrar qué correos están registrados.
    if (!user) return;

    const rawToken = randomBytes(32).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000),
      },
    });

    await this.auditService.record({ actorUserId: user.id, action: 'PASSWORD_RESET_REQUESTED' });

    // El envío real del correo/notificación se delega al módulo de notificaciones (pendiente de canal externo aprobado).
    // Por ahora se retorna el token solo en entornos no productivos para facilitar pruebas.
    if (this.configService.get('NODE_ENV') !== 'production') {
      return { debugToken: rawToken };
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = hashToken(token);
    const stored = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!stored || stored.usedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('El enlace de recuperación es inválido o expiró.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: stored.userId },
        data: { passwordHash, failedLoginAttempts: 0, mustChangePassword: false },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: stored.id },
        data: { usedAt: new Date() },
      }),
      // Revoca todas las sesiones activas al cambiar la contraseña.
      this.prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    await this.auditService.record({ actorUserId: stored.userId, action: 'PASSWORD_RESET_COMPLETED' });
  }

  private async issueTokens(userId: string, email: string, roleCode: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email, roleCode },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );

    const rawRefreshToken = randomBytes(40).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(rawRefreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }
}
