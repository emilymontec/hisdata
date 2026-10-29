import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ClinicalRecordService } from './clinical-record.service';
import { AddClinicalNoteDto } from './dto/add-note.dto';
import { AddDiagnosisDto } from './dto/add-diagnosis.dto';

@ApiTags('clinical-record')
@ApiBearerAuth()
@Controller('clinical-records')
export class ClinicalRecordController {
  constructor(private readonly clinicalRecordService: ClinicalRecordService) {}

  @Roles('MEDICO', 'ENFERMERIA', 'ADMIN')
  @Get('paciente/:patientId')
  view(@Param('patientId') patientId: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.clinicalRecordService.view(patientId, actor.id);
  }

  @Roles('MEDICO')
  @Post('paciente/:patientId/notas')
  addNote(
    @Param('patientId') patientId: string,
    @Body() dto: AddClinicalNoteDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.clinicalRecordService.addNote(patientId, dto, actor.id);
  }

  @Roles('MEDICO')
  @Post('paciente/:patientId/diagnosticos')
  addDiagnosis(
    @Param('patientId') patientId: string,
    @Body() dto: AddDiagnosisDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.clinicalRecordService.addDiagnosis(patientId, dto, actor.id);
  }
}
