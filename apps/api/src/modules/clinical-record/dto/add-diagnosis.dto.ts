import { IsOptional, IsString } from 'class-validator';

export class AddDiagnosisDto {
  @IsString()
  description: string;

  // Preparado para CIE-10 u otro estándar; sin validar contra catálogo oficial todavía.
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  codeSystem?: string;
}
