import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RegisterLabResultDto } from './dto/register-result.dto';
import { LaboratoryService } from './laboratory.service';

@ApiTags('laboratory')
@ApiBearerAuth()
@Controller('lab-requests')
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Roles('ENFERMERIA', 'MEDICO', 'ADMIN')
  @Patch(':id/muestra-tomada')
  registerSample(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.laboratoryService.registerSampleCollected(id, actor.id);
  }

  @Roles('MEDICO', 'ADMIN')
  @Patch(':id/resultado')
  registerResult(
    @Param('id') id: string,
    @Body() dto: RegisterLabResultDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.laboratoryService.registerResult(id, dto, actor.id);
  }

  @Roles('MEDICO')
  @Patch(':id/validar-publicar')
  validateAndPublish(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.laboratoryService.validateAndPublish(id, actor.id);
  }

  @Roles('MEDICO', 'ENFERMERIA', 'ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.laboratoryService.findOne(id, actor.id);
  }
}
