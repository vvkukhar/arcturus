import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBackupDto } from './dto/create-backup.dto';
import { RestoreBackupDto } from './dto/restore-backup.dto';

@Injectable()
export class BackupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateBackupDto): Promise<unknown> {
    const payload = {
      createdAt: new Date().toISOString(),
      items: await this.prisma.item.findMany(),
      inventoryItems: await this.prisma.inventoryItem.findMany(),
      watchlistItems: await this.prisma.watchlistItem.findMany(),
      warehouses: await this.prisma.warehouse.findMany(),
      storageLocations: await this.prisma.storageLocation.findMany(),
      stockMovements: await this.prisma.stockMovement.findMany(),
      inventoryImages: await this.prisma.inventoryImage.findMany(),
      sales: await this.prisma.sale.findMany(),
      orders: await this.prisma.order.findMany(),
      reserveRequests: await this.prisma.reserveRequest.findMany(),
      returnRequests: await this.prisma.returnRequest.findMany(),
      expenses: await this.prisma.expense.findMany(),
      purchaseOrders: await this.prisma.purchaseOrder.findMany(),
      marketSources: await this.prisma.marketSource.findMany(),
      marketListings: await this.prisma.marketListing.findMany(),
      marketSnapshots: await this.prisma.marketSnapshot.findMany(),
      decisionSnapshots: await this.prisma.decisionSnapshot.findMany(),
      reportSnapshots: await this.prisma.reportSnapshot.findMany(),
    };

    const snapshot = await this.prisma.backupSnapshot.create({
      data: {
        type: dto.type ?? 'manual',
        status: 'created',
        notes: dto.notes ?? null,
        payloadJson: payload,
      },
    });

    await this.activity.log('backup.created', {
      backupSnapshotId: snapshot.id,
      type: snapshot.type,
    });

    await this.audit.log({
      action: 'backup.created',
      entityType: 'BackupSnapshot',
      entityId: snapshot.id,
      beforeJson: null,
      afterJson: {
        type: snapshot.type,
        status: snapshot.status,
        notes: snapshot.notes,
      },
    });

    return snapshot;
  }

  async list(): Promise<unknown[]> {
    return this.prisma.backupSnapshot.findMany({
      select: {
        id: true,
        type: true,
        status: true,
        notes: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
  }

  async getById(id: string): Promise<unknown> {
    const snapshot = await this.prisma.backupSnapshot.findUnique({
      where: {
        id,
      },
    });

    if (!snapshot) {
      throw new NotFoundException('Backup snapshot not found');
    }

    return snapshot;
  }

  async restore(dto: RestoreBackupDto): Promise<unknown> {
    const snapshot = await this.prisma.backupSnapshot.findUnique({
      where: {
        id: dto.backupSnapshotId,
      },
    });

    if (!snapshot) {
      throw new NotFoundException('Backup snapshot not found');
    }

    const payload = snapshot.payloadJson as Record<string, any>;

    if (!payload || typeof payload !== 'object') {
      throw new BadRequestException('Invalid backup payload');
    }

    const dryRun = dto.dryRun ?? true;

    const summary = {
      items: payload.items?.length ?? 0,
      warehouses: payload.warehouses?.length ?? 0,
      storageLocations: payload.storageLocations?.length ?? 0,
      marketSources: payload.marketSources?.length ?? 0,
      expenses: payload.expenses?.length ?? 0,
      dryRun,
    };

    if (dryRun) {
      return {
        dryRun: true,
        message: 'Dry run only. No data restored.',
        summary,
      };
    }

    await this.prisma.$transaction(async (tx) => {
      for (const row of payload.items ?? []) {
        await tx.item.upsert({
          where: {
            id: row.id,
          },
          update: {
            kind: row.kind,
            title: row.title,
            setNumber: row.setNumber,
            theme: row.theme,
            conditionDefault: row.conditionDefault,
            imageUrl: row.imageUrl,
            notes: row.notes,
          },
          create: {
            id: row.id,
            kind: row.kind,
            title: row.title,
            setNumber: row.setNumber,
            theme: row.theme,
            conditionDefault: row.conditionDefault,
            imageUrl: row.imageUrl,
            notes: row.notes,
            createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
          },
        });
      }

      for (const row of payload.warehouses ?? []) {
        await tx.warehouse.upsert({
          where: {
            id: row.id,
          },
          update: {
            code: row.code,
            name: row.name,
            address: row.address,
            active: row.active,
          },
          create: {
            id: row.id,
            code: row.code,
            name: row.name,
            address: row.address,
            active: row.active,
            createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
          },
        });
      }

      for (const row of payload.storageLocations ?? []) {
        await tx.storageLocation.upsert({
          where: {
            id: row.id,
          },
          update: {
            warehouseId: row.warehouseId,
            code: row.code,
            name: row.name,
            zone: row.zone,
            shelf: row.shelf,
            box: row.box,
            active: row.active,
          },
          create: {
            id: row.id,
            warehouseId: row.warehouseId,
            code: row.code,
            name: row.name,
            zone: row.zone,
            shelf: row.shelf,
            box: row.box,
            active: row.active,
            createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
          },
        });
      }

      for (const row of payload.marketSources ?? []) {
        await tx.marketSource.upsert({
          where: {
            id: row.id,
          },
          update: {
            code: row.code,
            name: row.name,
            type: row.type,
            enabled: row.enabled,
          },
          create: {
            id: row.id,
            code: row.code,
            name: row.name,
            type: row.type,
            enabled: row.enabled,
            createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
          },
        });
      }

      for (const row of payload.expenses ?? []) {
        await tx.expense.upsert({
          where: {
            id: row.id,
          },
          update: {
            type: row.type,
            category: row.category,
            amount: row.amount,
            currency: row.currency,
            description: row.description,
            inventoryItemId: row.inventoryItemId,
            purchaseOrderId: row.purchaseOrderId,
            saleId: row.saleId,
            orderId: row.orderId,
            assignedUserId: row.assignedUserId,
            incurredAt: row.incurredAt ? new Date(row.incurredAt) : new Date(),
          },
          create: {
            id: row.id,
            type: row.type,
            category: row.category,
            amount: row.amount,
            currency: row.currency,
            description: row.description,
            inventoryItemId: row.inventoryItemId,
            purchaseOrderId: row.purchaseOrderId,
            saleId: row.saleId,
            orderId: row.orderId,
            assignedUserId: row.assignedUserId,
            incurredAt: row.incurredAt ? new Date(row.incurredAt) : new Date(),
            createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
          },
        });
      }
    });

    await this.prisma.backupSnapshot.update({
      where: {
        id: snapshot.id,
      },
      data: {
        status: 'restored',
      },
    });

    await this.activity.log('backup.restored', {
      backupSnapshotId: snapshot.id,
      summary,
    });

    await this.audit.log({
      action: 'backup.restored',
      entityType: 'BackupSnapshot',
      entityId: snapshot.id,
      beforeJson: {
        status: snapshot.status,
      },
      afterJson: {
        status: 'restored',
        summary,
      },
    });

    return {
      restored: true,
      summary,
    };
  }
}