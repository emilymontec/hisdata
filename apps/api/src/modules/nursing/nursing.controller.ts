import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateNursingNoteDto } from './dto/create-nursing-note.dto';
import { NursingService } from './nursing.service';

@ApiTags('nursing')
@ApiBearerAuth()
@Controller('nursing-notes')
export class NursingController {
  constructor(private readonly nursingService: NursingService) {}

  @Roles('ENFERMERIA', 'MEDICO')
  @Post()
  create(@Body() dto: CreateNursingNoteDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.nursingService.createNote(dto, actor.id);
  }

  @Roles('ENFERMERIA', 'MEDICO', 'ADMIN')
  @Get('admision/:admissionId')
  byAdmission(@Param('admissionId') admissionId: string) {
    return this.nursingService.findByAdmission(admissionId);
  }
}
