import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateConsultationDto {
  @IsUUID()
  patientId: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  findings?: string;

  @IsOptional()
  @IsString()
  plan?: string;
}
