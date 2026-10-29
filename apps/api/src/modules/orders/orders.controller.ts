import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateMedicalOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('medical-orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('MEDICO')
  @Post()
  create(@Body() dto: CreateMedicalOrderDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.ordersService.create(dto, actor.id);
  }

  @Roles('MEDICO', 'ENFERMERIA', 'ADMIN')
  @Get('paciente/:patientId')
  byPatient(@Param('patientId') patientId: string) {
    return this.ordersService.findByPatient(patientId);
  }

  @Roles('MEDICO', 'ENFERMERIA', 'ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles('MEDICO', 'ENFERMERIA')
  @Patch(':id/estado/:status')
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.ordersService.updateStatus(id, status, actor.id);
  }
}
