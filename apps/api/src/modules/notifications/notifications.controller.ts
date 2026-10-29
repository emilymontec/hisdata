import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() dto: CreateNotificationDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.notificationsService.create(dto, actor.id);
  }

  @Get('usuario/:userId')
  forUser(@Param('userId') userId: string) {
    return this.notificationsService.findForUser(userId);
  }

  @Get('paciente/:patientId')
  forPatient(@Param('patientId') patientId: string) {
    return this.notificationsService.findForPatient(patientId);
  }

  @Patch(':id/leida')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }
}
