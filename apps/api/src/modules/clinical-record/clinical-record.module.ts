import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { ClinicalRecordController } from './clinical-record.controller';
import { ClinicalRecordService } from './clinical-record.service';

@Module({
  imports: [AuditModule],
  controllers: [ClinicalRecordController],
  providers: [ClinicalRecordService],
  exports: [ClinicalRecordService],
})
export class ClinicalRecordModule {}
