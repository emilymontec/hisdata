import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum CertificateTypeDto {
  CONSTANCIA_ATENCION = 'CONSTANCIA_ATENCION',
  REMISION = 'REMISION',
  INCAPACIDAD = 'INCAPACIDAD',
  OTRO = 'OTRO',
}

export class CreateCertificateDto {
  @IsUUID()
  patientId: string;

  @IsEnum(CertificateTypeDto)
  type: CertificateTypeDto;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  documentUrl?: string;
}
