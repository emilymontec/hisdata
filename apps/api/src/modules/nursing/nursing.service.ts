import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateNursingNoteDto } from './dto/create-nursing-note.dto';

@Injectable()
export class NursingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createNote(dto: CreateNursingNoteDto, authorId: string) {
    const note = await this.prisma.nursingNote.create({
      data: {
        admissionId: dto.admissionId,
        authorId,
        observation: dto.observation,
        vitalSigns: dto.vitalSigns as any,
      },
    });

    await this.auditService.record({
      actorUserId: authorId,
      action: 'NURSING_NOTE_CREATE',
      entityType: 'NursingNote',
      entityId: note.id,
    });

    return note;
  }

  async findByAdmission(admissionId: string) {
    return this.prisma.nursingNote.findMany({
      where: { admissionId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
