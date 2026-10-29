import { IsString } from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  name: string;

  @IsString()
  category: string;
}
