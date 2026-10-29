import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddStockDto {
  @IsString()
  batchNumber: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  expiresAt?: string;
}
