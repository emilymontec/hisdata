import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Roles('ADMIN', 'ADMINISTRATIVO')
  @Post()
  create(@Body() dto: CreateAppointmentDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.appointmentsService.create(dto, actor.id);
  }

  @Roles('ADMIN', 'ADMINISTRATIVO', 'MEDICO', 'ENFERMERIA')
  @Get('paciente/:patientId')
  byPatient(@Param('patientId') patientId: string) {
    return this.appointmentsService.findByPatient(patientId);
  }

  @Roles('ADMIN', 'ADMINISTRATIVO', 'MEDICO')
  @Get('profesional/:practitionerId')
  byPractitioner(
    @Param('practitionerId') practitionerId: string,
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.appointmentsService.findByPractitionerAndRange(
      practitionerId,
      new Date(desde),
      new Date(hasta),
    );
  }

  @Roles('ADMIN', 'ADMINISTRATIVO')
  @Patch(':id/cancelar')
  cancel(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.appointmentsService.cancel(id, actor.id);
  }

  @Roles('ADMIN', 'ADMINISTRATIVO')
  @Patch(':id/reprogramar')
  reschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleAppointmentDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.appointmentsService.reschedule(id, dto, actor.id);
  }

  @Roles('ADMIN', 'ADMINISTRATIVO', 'MEDICO')
  @Patch(':id/completar')
  complete(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.appointmentsService.complete(id, actor.id);
  }
}
