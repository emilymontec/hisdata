import { IsInt, IsUUID, Min } from 'class-validator';

export class DispenseDto {
  @IsUUID()
  prescriptionItemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
