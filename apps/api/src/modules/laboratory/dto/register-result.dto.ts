import { IsOptional, IsString } from 'class-validator';

export class RegisterLabResultDto {
  @IsString()
  parameter: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  referenceRange?: string;
}
