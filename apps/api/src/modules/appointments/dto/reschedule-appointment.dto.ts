import { IsDateString } from 'class-validator';

export class RescheduleAppointmentDto {
  @IsDateString()
  newStartsAt: string;

  @IsDateString()
  newEndsAt: string;
}
