import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(10, { message: 'La nueva contraseña debe tener al menos 10 caracteres.' })
  newPassword: string;
}
