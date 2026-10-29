import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionsService } from './prescriptions.service';

@ApiTags('prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Roles('MEDICO')
  @Post()
  create(@Body() dto: CreatePrescriptionDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.prescriptionsService.create(dto, actor.id);
  }

  @Roles('MEDICO', 'ENFERMERIA', 'ADMIN')
  @Get('paciente/:patientId')
  byPatient(@Param('patientId') patientId: string) {
    return this.prescriptionsService.findByPatient(patientId);
  }

  @Roles('MEDICO', 'ENFERMERIA', 'ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }

  @Roles('MEDICO')
  @Patch(':id/cancelar')
  cancel(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.prescriptionsService.cancel(id, actor.id);
  }
}
