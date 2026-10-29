import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';

// El tipo y número de documento no se editan por este endpoint: un cambio de identificación
// requiere un flujo de verificación de identidad distinto, pendiente de definir.
export class UpdatePatientDto extends PartialType(
  OmitType(CreatePatientDto, ['documentType', 'documentNumber'] as const),
) {}
