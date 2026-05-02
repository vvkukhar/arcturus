// backend/api/src/modules/media/media.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

export type UploadedInventoryImageFile = {
  buffer: Buffer;
  mimetype: string;
};

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly activity: ActivityService,
  ) {}

  private buildDataUrl(file: UploadedInventoryImageFile): string {
    if (!file?.buffer || !file?.mimetype) {
      throw new BadRequestException('Invalid file');
    }

    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }

  async addInventoryImage(params: {
    inventoryItemId: string;
    file?: UploadedInventoryImageFile;
    imageUrl?: string;
    altText?: string | null;
  }): Promise<unknown> {
    const inventory = await this.prisma.inventoryItem.findUnique({
      where: {
        id: params.inventoryItemId,
      },
      include: {
        images: true,
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    const imageUrl = params.file
      ? this.buildDataUrl(params.file)
      : params.imageUrl?.trim();

    if (!imageUrl) {
      throw new BadRequestException('Image file or imageUrl is required');
    }

    const imageCount = inventory.images.length;

    const created = await this.prisma.inventoryImage.create({
      data: {
        inventoryItemId: inventory.id,
        imageUrl,
        altText: params.altText ?? inventory.titleSnapshot,
        isPrimary: imageCount === 0,
        sortOrder: imageCount,
      },
    });

    await this.activity.log('inventory.image_added', {
      inventoryItemId: inventory.id,
      imageId: created.id,
    });

    this.realtime.emitInventoryRefresh({
      inventoryItemId: inventory.id,
      imageId: created.id,
      reason: 'image_added',
    });

    return created;
  }

  async deleteInventoryImage(imageId: string): Promise<unknown> {
    const existing = await this.prisma.inventoryImage.findUnique({
      where: { id: imageId },
    });

    if (!existing) {
      throw new NotFoundException('Image not found');
    }

    const deleted = await this.prisma.inventoryImage.delete({
      where: { id: imageId },
    });

    if (existing.isPrimary) {
      const next = await this.prisma.inventoryImage.findFirst({
        where: {
          inventoryItemId: existing.inventoryItemId,
        },
        orderBy: {
          sortOrder: 'asc',
        },
      });

      if (next) {
        await this.prisma.inventoryImage.update({
          where: { id: next.id },
          data: { isPrimary: true },
        });
      }
    }

    await this.activity.log('inventory.image_deleted', {
      inventoryItemId: existing.inventoryItemId,
      imageId,
    });

    this.realtime.emitInventoryRefresh({
      inventoryItemId: existing.inventoryItemId,
      imageId,
      deleted: true,
    });

    return deleted;
  }

  async setPrimaryInventoryImage(imageId: string): Promise<unknown> {
    const image = await this.prisma.inventoryImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.prisma.inventoryImage.updateMany({
      where: {
        inventoryItemId: image.inventoryItemId,
      },
      data: {
        isPrimary: false,
      },
    });

    const updated = await this.prisma.inventoryImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    await this.activity.log('inventory.image_primary_set', {
      inventoryItemId: image.inventoryItemId,
      imageId,
    });

    this.realtime.emitInventoryRefresh({
      inventoryItemId: image.inventoryItemId,
      imageId,
      reason: 'primary_image_set',
    });

    return updated;
  }

  async reorderInventoryImages(params: {
    inventoryItemId: string;
    imageIds: string[];
  }): Promise<unknown> {
    const inventory = await this.prisma.inventoryItem.findUnique({
      where: {
        id: params.inventoryItemId,
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    const imageIds = Array.isArray(params.imageIds)
      ? params.imageIds.filter(Boolean)
      : [];

    await this.prisma.$transaction(
      imageIds.map((imageId, index) =>
        this.prisma.inventoryImage.update({
          where: { id: imageId },
          data: { sortOrder: index },
        }),
      ),
    );

    await this.activity.log('inventory.images_reordered', {
      inventoryItemId: params.inventoryItemId,
      imageIds,
    });

    this.realtime.emitInventoryRefresh({
      inventoryItemId: params.inventoryItemId,
      imageIds,
      reason: 'images_reordered',
    });

    return {
      ok: true,
      count: imageIds.length,
    };
  }

  async listInventoryImages(inventoryItemId: string): Promise<unknown[]> {
    return this.prisma.inventoryImage.findMany({
      where: {
        inventoryItemId,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }
}