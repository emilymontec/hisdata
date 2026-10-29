import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { TransferDto } from './dto/transfer.dto';

@ApiTags('admissions')
@ApiBearerAuth()
@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Roles('ADMIN', 'ADMINISTRATIVO', 'MEDICO')
  @Post()
  create(@Body() dto: CreateAdmissionDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.admissionsService.create(dto, actor.id);
  }

  @Roles('ADMIN', 'ADMINISTRATIVO', 'MEDICO', 'ENFERMERIA')
  @Get('camas/disponibilidad')
  bedAvailability() {
    return this.admissionsService.bedAvailability();
  }

  @Roles('ADMIN', 'ADMINISTRATIVO', 'MEDICO')
  @Patch(':id/traslado')
  transfer(
    @Param('id') id: string,
    @Body() dto: TransferDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.admissionsService.transfer(id, dto, actor.id);
  }

  @Roles('ADMIN', 'ADMINISTRATIVO', 'MEDICO')
  @Patch(':id/egreso')
  discharge(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.admissionsService.discharge(id, actor.id);
  }
}
