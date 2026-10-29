import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateInventoryItemDto } from './dto/create-item.dto';
import { RegisterMovementDto } from './dto/register-movement.dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createItem(dto: CreateInventoryItemDto, actorUserId: string) {
    const item = await this.prisma.inventoryItem.create({ data: dto });
    await this.auditService.record({
      actorUserId,
      action: 'INVENTORY_ITEM_CREATE',
      entityType: 'InventoryItem',
      entityId: item.id,
    });
    return item;
  }

  async listItems() {
    return this.prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } });
  }

  async registerMovement(itemId: string, dto: RegisterMovementDto, actorUserId: string) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Insumo/equipo no encontrado.');

    let newQuantity = item.quantity;
    if (dto.type === 'IN') newQuantity += dto.quantity;
    else if (dto.type === 'OUT') newQuantity -= dto.quantity;
    else newQuantity = dto.quantity; // ADJUSTMENT fija la cantidad exacta

    if (newQuantity < 0) {
      throw new BadRequestException('El movimiento dejaría el inventario en cantidad negativa.');
    }

    const [, movement] = await this.prisma.$transaction([
      this.prisma.inventoryItem.update({ where: { id: itemId }, data: { quantity: newQuantity } }),
      this.prisma.inventoryMovement.create({
        data: {
          inventoryItemId: itemId,
          type: dto.type,
          quantity: dto.quantity,
          registeredById: actorUserId,
        },
      }),
    ]);

    await this.auditService.record({
      actorUserId,
      action: 'INVENTORY_MOVEMENT',
      entityType: 'InventoryItem',
      entityId: itemId,
      metadata: { tipo: dto.type, cantidad: dto.quantity },
    });

    return movement;
  }
}
