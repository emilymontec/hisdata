import { IsString } from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  name: string;

  @IsString()
  presentation: string;
}
