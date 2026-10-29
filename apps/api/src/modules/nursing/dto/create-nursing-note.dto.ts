import { IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNursingNoteDto {
  @IsOptional()
  @IsUUID()
  admissionId?: string;

  @IsString()
  observation: string;

  // Estructura libre por ahora (ej. { temperatura, presionArterial, frecuenciaCardiaca });
  // el conjunto formal de signos vitales a capturar queda pendiente de validación con enfermería.
  @IsOptional()
  @IsObject()
  vitalSigns?: Record<string, unknown>;
}
