import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { ClinicalRecordModule } from '../clinical-record/clinical-record.module';
import { MedicalConsultationController } from './medical-consultation.controller';
import { MedicalConsultationService } from './medical-consultation.service';

@Module({
  imports: [AuditModule, ClinicalRecordModule],
  controllers: [MedicalConsultationController],
  providers: [MedicalConsultationService],
  exports: [MedicalConsultationService],
})
export class MedicalConsultationModule {}
