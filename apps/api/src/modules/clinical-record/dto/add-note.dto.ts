import { IsString, MinLength } from 'class-validator';

export class AddClinicalNoteDto {
  @IsString()
  @MinLength(3)
  content: string;
}
