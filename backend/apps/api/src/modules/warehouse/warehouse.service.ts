import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateStorageLocationDto } from './dto/create-storage-location.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { MoveInventoryDto } from './dto/move-inventory.dto';
import { UpdateStorageLocationDto } from './dto/update-storage-location.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async listWarehouses(): Promise<unknown[]> {
    return this.prisma.warehouse.findMany({
      include: { locations: { orderBy: { code: 'asc' } } },
      orderBy: { code: 'asc' },
    });
  }

  async getWarehouse(id: string): Promise<unknown> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        locations: {
          include: { _count: { select: { inventoryItems: true } } },
          orderBy: { code: 'asc' },
        },
      },
    });

    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }

  async createWarehouse(dto: CreateWarehouseDto): Promise<unknown> {
    const code = dto.code.trim().toLowerCase();
    if (!code) throw new BadRequestException('Warehouse code is required');

    const created = await this.prisma.warehouse.create({
      data: {
        code,
        name: dto.name.trim(),
        address: dto.address ?? null,
        active: dto.active ?? true,
      },
    });

    await this.activity.log('warehouse.created', { warehouseId: created.id, code: created.code, name: created.name });
    this.realtime.emitCustom('warehouse.updated', created);

    return created;
  }

  async updateWarehouse(dto: UpdateWarehouseDto): Promise<unknown> {
    const existing = await this.prisma.warehouse.findUnique({ where: { id: dto.id } });
    if (!existing) throw new NotFoundException('Warehouse not found');

    const updated = await this.prisma.warehouse.update({
      where: { id: dto.id },
      data: {
        code: dto.code?.trim().toLowerCase(),
        name: dto.name?.trim(),
        address: dto.address,
        active: dto.active,
      },
    });

    await this.activity.log('warehouse.updated', { warehouseId: updated.id, code: updated.code, name: updated.name });
    this.realtime.emitCustom('warehouse.updated', updated);

    return updated;
  }

  async listLocations(warehouseId?: string): Promise<unknown[]> {
    return this.prisma.storageLocation.findMany({
      where: warehouseId ? { warehouseId } : undefined,
      include: { warehouse: true, _count: { select: { inventoryItems: true } } },
      orderBy: [{ warehouseId: 'asc' }, { code: 'asc' }],
    });
  }

  async getLocation(id: string): Promise<unknown> {
    const location = await this.prisma.storageLocation.findUnique({
      where: { id },
      include: {
        warehouse: true,
        inventoryItems: { include: { item: true, assignedUser: true }, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!location) throw new NotFoundException('Storage location not found');
    return location;
  }

  async createLocation(dto: CreateStorageLocationDto): Promise<unknown> {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id: dto.warehouseId } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');

    const created = await this.prisma.storageLocation.create({
      data: {
        warehouseId: dto.warehouseId,
        code: dto.code.trim(),
        name: dto.name.trim(),
        zone: dto.zone ?? null,
        shelf: dto.shelf ?? null,
        box: dto.box ?? null,
        active: dto.active ?? true,
      },
      include: { warehouse: true },
    });

    await this.activity.log('storage_location.created', { storageLocationId: created.id, warehouseId: created.warehouseId, code: created.code, name: created.name });
    this.realtime.emitCustom('storage_location.updated', created);

    return created;
  }

  async updateLocation(dto: UpdateStorageLocationDto): Promise<unknown> {
    const existing = await this.prisma.storageLocation.findUnique({ where: { id: dto.id } });
    if (!existing) throw new NotFoundException('Storage location not found');

    const updated = await this.prisma.storageLocation.update({
      where: { id: dto.id },
      data: {
        code: dto.code?.trim(),
        name: dto.name?.trim(),
        zone: dto.zone,
        shelf: dto.shelf,
        box: dto.box,
        active: dto.active,
      },
      include: { warehouse: true },
    });

    await this.activity.log('storage_location.updated', { storageLocationId: updated.id, warehouseId: updated.warehouseId, code: updated.code, name: updated.name });
    this.realtime.emitCustom('storage_location.updated', updated);

    return updated;
  }

  async moveInventory(dto: MoveInventoryDto): Promise<unknown> {
    const inventory = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.inventoryItemId },
      include: { location: true },
    });

    if (!inventory) throw new NotFoundException('Inventory item not found');

    const target = dto.toStorageLocationId
      ? await this.prisma.storageLocation.findUnique({ where: { id: dto.toStorageLocationId }, include: { warehouse: true } })
      : null;

    if (dto.toStorageLocationId && !target) throw new NotFoundException('Target storage location not found');

    const movementQuantity = dto.quantity ?? inventory.quantity;
    if (movementQuantity > inventory.quantity) throw new BadRequestException('Movement quantity exceeds inventory quantity');

    const updated = await this.prisma.$transaction(async (tx) => {
      const row = await tx.inventoryItem.update({
        where: { id: dto.inventoryItemId },
        data: { storageLocationId: target?.id ?? null, warehouseId: target?.warehouseId ?? null, storageLocation: target?.name ?? null },
        include: { item: true, assignedUser: true, location: { include: { warehouse: true } } },
      });

      await tx.stockMovement.create({
        data: {
          inventoryItemId: inventory.id,
          warehouseId: target?.warehouseId ?? null,
          fromStorageLocationId: inventory.storageLocationId ?? null,
          toStorageLocationId: target?.id ?? null,
          type: 'move',
          quantity: movementQuantity,
          reason: dto.reason ?? null,
        },
      });

      return row;
    });

    await this.activity.log('inventory.moved', { inventoryItemId: inventory.id, fromStorageLocationId: inventory.storageLocationId, toStorageLocationId: target?.id ?? null, quantity: movementQuantity, reason: dto.reason ?? null });
    this.realtime.emitInventoryUpdated(updated);
    this.realtime.emitCustom('warehouse.inventory_moved', updated);

    return updated;
  }

  async movements(inventoryItemId?: string): Promise<unknown[]> {
    return this.prisma.stockMovement.findMany({
      where: inventoryItemId ? { inventoryItemId } : undefined,
      include: { inventoryItem: { include: { item: true } }, warehouse: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async warehouseSnapshot(): Promise<unknown[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      include: { locations: { select: { id: true } } },
      orderBy: { code: 'asc' },
    });

    const inventoryAggs = await Promise.all(
      warehouses.map(w =>
        this.prisma.inventoryItem.aggregate({
          where: { warehouseId: w.id },
          _sum: { quantity: true, totalCost: true },
          _count: true
        })
      )
    );

    return warehouses.map((warehouse, index) => {
      const agg = inventoryAggs[index];
      return {
        id: warehouse.id,
        code: warehouse.code,
        name: warehouse.name,
        active: warehouse.active,
        locations: warehouse.locations.length,
        inventoryItems: agg._count,
        units: agg._sum.quantity ?? 0,
        costBasis: agg._sum.totalCost ?? 0,
      };
    });
  }
}