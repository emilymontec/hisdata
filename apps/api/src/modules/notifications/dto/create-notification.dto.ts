import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum NotificationChannelDto {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
}

export class CreateNotificationDto {
  @IsOptional()
  @IsUUID()
  recipientPatientId?: string;

  @IsOptional()
  @IsUUID()
  recipientUserId?: string;

  @IsOptional()
  @IsEnum(NotificationChannelDto)
  channel?: NotificationChannelDto;

  @IsString()
  title: string;

  @IsString()
  body: string;
}
