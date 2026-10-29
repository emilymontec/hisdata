import { IsDateString, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export enum DocumentTypeDto {
  CC = 'CC',
  TI = 'TI',
  CE = 'CE',
  PASAPORTE = 'PASAPORTE',
  REGISTRO_CIVIL = 'REGISTRO_CIVIL',
  OTRO = 'OTRO',
}

export class CreatePatientDto {
  @IsEnum(DocumentTypeDto)
  documentType: DocumentTypeDto;

  @IsString()
  documentNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  sex: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
