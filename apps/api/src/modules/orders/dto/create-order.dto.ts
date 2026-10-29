import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum MedicalOrderTypeDto {
  LABORATORY = 'LABORATORY',
  IMAGING = 'IMAGING',
  PROCEDURE = 'PROCEDURE',
}

export class CreateMedicalOrderDto {
  @IsUUID()
  patientId: string;

  @IsOptional()
  @IsUUID()
  consultationId?: string;

  @IsEnum(MedicalOrderTypeDto)
  type: MedicalOrderTypeDto;

  @IsString()
  description: string;

  // Solo aplica cuando type = IMAGING (modalidad: RX, TAC, RM, ECO, etc.)
  @IsOptional()
  @IsString()
  imagingModality?: string;
}
