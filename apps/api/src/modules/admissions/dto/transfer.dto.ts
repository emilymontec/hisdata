import { IsOptional, IsString, IsUUID } from 'class-validator';

export class TransferDto {
  @IsUUID()
  toBedId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
