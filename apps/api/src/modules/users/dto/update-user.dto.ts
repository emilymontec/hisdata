import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  roleCode?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'SUSPENDED', 'LOCKED'])
  status?: 'ACTIVE' | 'SUSPENDED' | 'LOCKED';
}
