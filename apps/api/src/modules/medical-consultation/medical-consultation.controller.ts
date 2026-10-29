import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { MedicalConsultationService } from './medical-consultation.service';

@ApiTags('medical-consultation')
@ApiBearerAuth()
@Controller('consultations')
export class MedicalConsultationController {
  constructor(private readonly consultationService: MedicalConsultationService) {}

  @Roles('MEDICO')
  @Post()
  create(@Body() dto: CreateConsultationDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.consultationService.create(dto, actor.id);
  }

  @Roles('MEDICO', 'ENFERMERIA', 'ADMIN')
  @Get('paciente/:patientId')
  byPatient(@Param('patientId') patientId: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.consultationService.findByPatient(patientId, actor.id);
  }

  @Roles('MEDICO', 'ENFERMERIA', 'ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultationService.findOne(id);
  }
}
