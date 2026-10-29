import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AddStockDto } from './dto/add-stock.dto';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { DispenseDto } from './dto/dispense.dto';
import { PharmacyService } from './pharmacy.service';

@ApiTags('pharmacy')
@ApiBearerAuth()
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Roles('ADMIN')
  @Post('medicamentos')
  createMedication(@Body() dto: CreateMedicationDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.pharmacyService.createMedication(dto, actor.id);
  }

  @Roles('ADMIN', 'MEDICO', 'ENFERMERIA')
  @Get('medicamentos')
  listCatalog() {
    return this.pharmacyService.listCatalog();
  }

  @Roles('ADMIN')
  @Post('medicamentos/:medicationId/stock')
  addStock(
    @Param('medicationId') medicationId: string,
    @Body() dto: AddStockDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.pharmacyService.addStock(medicationId, dto, actor.id);
  }

  @Roles('ADMIN', 'ENFERMERIA')
  @Post('dispensaciones')
  dispense(@Body() dto: DispenseDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.pharmacyService.dispense(dto, actor.id);
  }
}
