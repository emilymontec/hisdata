import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { NursingController } from './nursing.controller';
import { NursingService } from './nursing.service';

@Module({
  imports: [AuditModule],
  controllers: [NursingController],
  providers: [NursingService],
  exports: [NursingService],
})
export class NursingModule {}
