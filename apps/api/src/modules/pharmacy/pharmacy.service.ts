import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AddStockDto } from './dto/add-stock.dto';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { DispenseDto } from './dto/dispense.dto';

@Injectable()
export class PharmacyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createMedication(dto: CreateMedicationDto, actorUserId: string) {
    const medication = await this.prisma.medication.create({ data: dto });
    await this.auditService.record({
      actorUserId,
      action: 'MEDICATION_CREATE',
      entityType: 'Medication',
      entityId: medication.id,
    });
    return medication;
  }

  async listCatalog() {
    return this.prisma.medication.findMany({ include: { stock: true }, orderBy: { name: 'asc' } });
  }

  async addStock(medicationId: string, dto: AddStockDto, actorUserId: string) {
    const medication = await this.prisma.medication.findUnique({ where: { id: medicationId } });
    if (!medication) throw new NotFoundException('Medicamento no encontrado en el catálogo.');

    const stock = await this.prisma.pharmacyStock.create({
      data: {
        medicationId,
        batchNumber: dto.batchNumber,
        quantity: dto.quantity,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });

    await this.auditService.record({
      actorUserId,
      action: 'PHARMACY_STOCK_IN',
      entityType: 'PharmacyStock',
      entityId: stock.id,
      metadata: { medicationId, cantidad: dto.quantity },
    });

    return stock;
  }

  /** Dispensación con descuento FIFO por fecha de vencimiento más próxima. */
  async dispense(dto: DispenseDto, dispensedById: string) {
    const item = await this.prisma.prescriptionItem.findUnique({
      where: { id: dto.prescriptionItemId },
      include: { prescription: true },
    });
    if (!item) throw new NotFoundException('Ítem de prescripción no encontrado.');
    if (item.prescription.status !== 'ACTIVE') {
      throw new BadRequestException('La prescripción no está activa.');
    }
    if (!item.medicationId) {
      throw new BadRequestException(
        'Este ítem no está vinculado a un medicamento del catálogo y no puede dispensarse desde farmacia.',
      );
    }

    const batches = await this.prisma.pharmacyStock.findMany({
      where: { medicationId: item.medicationId, quantity: { gt: 0 } },
      orderBy: [{ expiresAt: 'asc' }],
    });

    const totalAvailable = batches.reduce((sum, b) => sum + b.quantity, 0);
    if (totalAvailable < dto.quantity) {
      throw new BadRequestException('Stock insuficiente para dispensar la cantidad solicitada.');
    }

    let remaining = dto.quantity;
    const operations: any[] = [];
    for (const batch of batches) {
      if (remaining <= 0) break;
      const taken = Math.min(batch.quantity, remaining);
      operations.push(
        this.prisma.pharmacyStock.update({
          where: { id: batch.id },
          data: { quantity: batch.quantity - taken },
        }),
      );
      remaining -= taken;
    }

    operations.push(
      this.prisma.dispensationRecord.create({
        data: {
          prescriptionItemId: item.id,
          dispensedById,
          quantity: dto.quantity,
        },
      }),
    );

    const results = await this.prisma.$transaction(operations);
    const record = results[results.length - 1];

    await this.auditService.record({
      actorUserId: dispensedById,
      action: 'PHARMACY_DISPENSE',
      entityType: 'DispensationRecord',
      entityId: record.id,
      metadata: { prescriptionItemId: item.id, cantidad: dto.quantity },
    });

    return record;
  }
}
