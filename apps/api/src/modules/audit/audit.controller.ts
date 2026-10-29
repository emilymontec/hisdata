import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('audit')
@ApiBearerAuth()
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Roles('AUDITOR', 'ADMIN')
  @Get()
  findAll(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('take') take = '50',
  ) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType: entityType || undefined,
        entityId: entityId || undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: Number(take),
    });
  }

  @Roles('AUDITOR', 'ADMIN')
  @Get('usuario/:actorUserId')
  findByActor(@Param('actorUserId') actorUserId: string) {
    return this.prisma.auditLog.findMany({
      where: { actorUserId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
