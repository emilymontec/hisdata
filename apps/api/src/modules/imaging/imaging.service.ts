import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateImagingReportDto } from './dto/create-report.dto';

@Injectable()
export class ImagingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async markInProgress(imagingRequestId: string, actorUserId: string) {
    const request = await this.getOrFail(imagingRequestId);
    const updated = await this.prisma.imagingRequest.update({
      where: { id: request.id },
      data: { status: 'IN_PROGRESS' },
    });
    await this.auditService.record({
      actorUserId,
      action: 'IMAGING_IN_PROGRESS',
      entityType: 'ImagingRequest',
      entityId: request.id,
    });
    return updated;
  }

  async createReport(imagingRequestId: string, dto: CreateImagingReportDto, reportedById: string) {
    const request = await this.getOrFail(imagingRequestId);

    const [report] = await this.prisma.$transaction([
      this.prisma.imagingReport.create({
        data: { imagingRequestId: request.id, reportedById, ...dto },
      }),
      this.prisma.imagingRequest.update({
        where: { id: request.id },
        data: { status: 'REPORTED' },
      }),
    ]);

    await this.auditService.record({
      actorUserId: reportedById,
      action: 'IMAGING_REPORT_CREATE',
      entityType: 'ImagingReport',
      entityId: report.id,
    });

    return report;
  }

  async findOne(id: string, actorUserId: string) {
    const request = await this.prisma.imagingRequest.findUnique({
      where: { id },
      include: { report: true },
    });
    if (!request) throw new NotFoundException('Solicitud de imagenología no encontrada.');

    await this.auditService.record({
      actorUserId,
      action: 'IMAGING_REQUEST_READ',
      entityType: 'ImagingRequest',
      entityId: id,
    });

    return request;
  }

  private async getOrFail(id: string) {
    const request = await this.prisma.imagingRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Solicitud de imagenología no encontrada.');
    return request;
  }
}
