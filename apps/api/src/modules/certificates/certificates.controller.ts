import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@ApiTags('certificates')
@ApiBearerAuth()
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Roles('MEDICO', 'ADMINISTRATIVO')
  @Post()
  create(@Body() dto: CreateCertificateDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.certificatesService.create(dto, actor.id);
  }

  @Roles('MEDICO', 'ADMINISTRATIVO', 'ADMIN')
  @Get('paciente/:patientId')
  byPatient(@Param('patientId') patientId: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.certificatesService.findByPatient(patientId, actor.id);
  }

  @Roles('MEDICO', 'ADMINISTRATIVO', 'ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(id);
  }
}
