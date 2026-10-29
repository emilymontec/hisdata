import { IsEnum, IsInt, Min } from 'class-validator';

export enum InventoryMovementTypeDto {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
}

export class RegisterMovementDto {
  @IsEnum(InventoryMovementTypeDto)
  type: InventoryMovementTypeDto;

  @IsInt()
  @Min(1)
  quantity: number;
}
