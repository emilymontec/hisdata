import { IsOptional, IsString } from 'class-validator';

export class CreateImagingReportDto {
  @IsString()
  findings: string;

  // URL del documento en el almacenamiento de archivos (ver ADR-004-almacenamiento, pendiente).
  @IsOptional()
  @IsString()
  documentUrl?: string;
}
