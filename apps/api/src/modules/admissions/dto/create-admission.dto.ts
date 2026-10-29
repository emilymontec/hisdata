import { IsOptional, IsUUID } from 'class-validator';

export class CreateAdmissionDto {
  @IsUUID()
  patientId: string;

  @IsOptional()
  @IsUUID()
  bedId?: string;
}
