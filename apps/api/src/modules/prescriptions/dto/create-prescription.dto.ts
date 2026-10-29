import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class PrescriptionItemDto {
  @IsOptional()
  @IsUUID()
  medicationId?: string;

  // Usado solo si el medicamento todavía no está en el catálogo de farmacia.
  @IsOptional()
  @IsString()
  freeTextDrug?: string;

  @IsString()
  dosageInstructions: string;
}

export class CreatePrescriptionDto {
  @IsUUID()
  patientId: string;

  @IsOptional()
  @IsUUID()
  consultationId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];
}
