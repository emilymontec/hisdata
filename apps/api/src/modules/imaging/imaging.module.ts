import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { ImagingController } from './imaging.controller';
import { ImagingService } from './imaging.service';

@Module({
  imports: [AuditModule],
  controllers: [ImagingController],
  providers: [ImagingService],
  exports: [ImagingService],
})
export class ImagingModule {}
