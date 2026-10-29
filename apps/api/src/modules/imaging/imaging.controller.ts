import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateImagingReportDto } from './dto/create-report.dto';
import { ImagingService } from './imaging.service';

@ApiTags('imaging')
@ApiBearerAuth()
@Controller('imaging-requests')
export class ImagingController {
  constructor(private readonly imagingService: ImagingService) {}

  @Roles('MEDICO', 'ADMIN')
  @Patch(':id/en-proceso')
  markInProgress(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.imagingService.markInProgress(id, actor.id);
  }

  @Roles('MEDICO')
  @Patch(':id/informe')
  createReport(
    @Param('id') id: string,
    @Body() dto: CreateImagingReportDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.imagingService.createReport(id, dto, actor.id);
  }

  @Roles('MEDICO', 'ENFERMERIA', 'ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.imagingService.findOne(id, actor.id);
  }
}
