import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsService } from './patients.service';

@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Roles('ADMIN', 'ADMINISTRATIVO', 'MEDICO', 'ENFERMERIA')
  @Post()
  create(@Body() dto: CreatePatientDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.patientsService.create(dto, actor.id);
  }

  @Roles('ADMIN', 'ADMINISTRATIVO', 'MEDICO', 'ENFERMERIA')
  @Get()
  search(@Query('q') q: string) {
    return this.patientsService.search(q ?? '');
  }

  @Roles('ADMIN', 'ADMINISTRATIVO')
  @Get('duplicados/pendientes')
  pendingDuplicates() {
    return this.patientsService.listPendingDuplicateReview();
  }

  @Roles('ADMIN', 'ADMINISTRATIVO', 'MEDICO', 'ENFERMERIA')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Roles('ADMIN', 'ADMINISTRATIVO')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.patientsService.update(id, dto, actor.id);
  }

  @Roles('ADMIN', 'ADMINISTRATIVO')
  @Patch(':id/duplicados/descartar')
  dismissDuplicate(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.patientsService.dismissDuplicateFlag(id, actor.id);
  }
}
