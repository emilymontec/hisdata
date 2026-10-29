import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateUserDto, actorUserId: string) {
    const role = await this.prisma.role.findUnique({ where: { code: dto.roleCode } });
    if (!role) throw new BadRequestException(`El rol '${dto.roleCode}' no existe.`);

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Ya existe un usuario con ese correo electrónico.');

    const passwordHash = await bcrypt.hash(dto.temporaryPassword, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        passwordHash,
        roleId: role.id,
        mustChangePassword: true, // obliga a cambiar la contraseña temporal en el primer ingreso
      },
      include: { role: true },
    });

    await this.auditService.record({
      actorUserId,
      action: 'USER_CREATE',
      entityType: 'User',
      entityId: user.id,
    });

    return this.sanitize(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({ include: { role: true } });
    return users.map(this.sanitize);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { role: true } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    return this.sanitize(user);
  }

  async update(id: string, dto: UpdateUserDto, actorUserId: string) {
    const data: Record<string, unknown> = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      status: dto.status,
    };

    if (dto.roleCode) {
      const role = await this.prisma.role.findUnique({ where: { code: dto.roleCode } });
      if (!role) throw new BadRequestException(`El rol '${dto.roleCode}' no existe.`);
      data.roleId = role.id;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });

    await this.auditService.record({
      actorUserId,
      action: 'USER_UPDATE',
      entityType: 'User',
      entityId: id,
    });

    return this.sanitize(user);
  }

  async changeOwnPassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) throw new BadRequestException('La contraseña actual no es correcta.');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, mustChangePassword: false },
    });

    await this.auditService.record({
      actorUserId: userId,
      action: 'PASSWORD_CHANGED_BY_USER',
      entityType: 'User',
      entityId: userId,
    });
  }

  // Nunca se devuelve passwordHash al cliente.
  private sanitize(user: any) {
    const { passwordHash, ...safe } = user;
    return safe;
  }
}
