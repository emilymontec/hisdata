import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PharmacyService } from '../pharmacy.service';

function buildService(options: {
  item: any;
  batches: any[];
}) {
  const prisma: any = {
    prescriptionItem: {
      findUnique: jest.fn().mockResolvedValue(options.item),
    },
    pharmacyStock: {
      findMany: jest.fn().mockResolvedValue(options.batches),
      update: jest.fn().mockImplementation(({ where, data }) =>
        Promise.resolve({ id: where.id, ...data }),
      ),
    },
    dispensationRecord: {
      create: jest.fn().mockImplementation(({ data }) =>
        Promise.resolve({ id: 'dispensation-1', ...data }),
      ),
    },
    $transaction: jest.fn().mockImplementation((ops: Promise<any>[]) => Promise.all(ops)),
  };
  const audit: any = { record: jest.fn().mockResolvedValue(undefined) };
  const service = new PharmacyService(prisma, audit);
  return { service, prisma, audit };
}

describe('PharmacyService.dispense', () => {
  const activePrescriptionItem = {
    id: 'item-1',
    medicationId: 'med-1',
    prescription: { status: 'ACTIVE' },
  };

  it('rechaza si el ítem no existe', async () => {
    const { service } = buildService({ item: null, batches: [] });
    await expect(
      service.dispense({ prescriptionItemId: 'nope', quantity: 1 }, 'actor-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rechaza si la prescripción no está activa', async () => {
    const { service } = buildService({
      item: { ...activePrescriptionItem, prescription: { status: 'CANCELLED' } },
      batches: [],
    });
    await expect(
      service.dispense({ prescriptionItemId: 'item-1', quantity: 1 }, 'actor-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rechaza si el stock total es insuficiente', async () => {
    const { service } = buildService({
      item: activePrescriptionItem,
      batches: [{ id: 'batch-1', quantity: 2, expiresAt: new Date('2027-01-01') }],
    });
    await expect(
      service.dispense({ prescriptionItemId: 'item-1', quantity: 5 }, 'actor-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('descuenta primero del lote con vencimiento más próximo (FIFO)', async () => {
    const { service, prisma, audit } = buildService({
      item: activePrescriptionItem,
      batches: [
        { id: 'batch-proximo', quantity: 3, expiresAt: new Date('2027-01-01') },
        { id: 'batch-lejano', quantity: 10, expiresAt: new Date('2028-01-01') },
      ],
    });

    await service.dispense({ prescriptionItemId: 'item-1', quantity: 5 }, 'actor-1');

    // Se descuentan 3 unidades del lote próximo a vencer (queda en 0) y 2 del lote lejano (queda en 8).
    expect(prisma.pharmacyStock.update).toHaveBeenCalledWith({
      where: { id: 'batch-proximo' },
      data: { quantity: 0 },
    });
    expect(prisma.pharmacyStock.update).toHaveBeenCalledWith({
      where: { id: 'batch-lejano' },
      data: { quantity: 8 },
    });
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'PHARMACY_DISPENSE' }),
    );
  });
});
