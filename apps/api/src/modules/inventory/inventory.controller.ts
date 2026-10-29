import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateInventoryItemDto } from './dto/create-item.dto';
import { RegisterMovementDto } from './dto/register-movement.dto';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Roles('ADMIN', 'ADMINISTRATIVO')
  @Post('items')
  createItem(@Body() dto: CreateInventoryItemDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.inventoryService.createItem(dto, actor.id);
  }

  @Roles('ADMIN', 'ADMINISTRATIVO', 'ENFERMERIA')
  @Get('items')
  listItems() {
    return this.inventoryService.listItems();
  }

  @Roles('ADMIN', 'ADMINISTRATIVO')
  @Post('items/:id/movimientos')
  registerMovement(
    @Param('id') id: string,
    @Body() dto: RegisterMovementDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.inventoryService.registerMovement(id, dto, actor.id);
  }
}
