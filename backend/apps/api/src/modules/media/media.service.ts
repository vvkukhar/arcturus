import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export type UploadedInventoryImageFile = {
  buffer: Buffer;
  mimetype: string;
};

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private s3Client: S3Client | null = null;
  private isS3Configured = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly activity: ActivityService,
  ) {
    if (process.env.S3_BUCKET && process.env.S3_ACCESS_KEY) {
      this.s3Client = new S3Client({
        region: process.env.S3_REGION || 'eu-central-1',
        endpoint: process.env.S3_ENDPOINT, 
        forcePathStyle: true, // ВАЖЛИВО ДЛЯ SUPABASE S3
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
      });
      this.isS3Configured = true;
      this.logger.log('S3 Storage successfully configured with Supabase');
    } else {
      this.logger.warn('S3 is not configured. Falling back to Base64 storage (Not recommended for Production).');
    }
  }

  private async uploadImage(file: UploadedInventoryImageFile): Promise<string> {
    if (!file?.buffer || !file?.mimetype) {
      throw new BadRequestException('Invalid file');
    }

    if (this.isS3Configured && this.s3Client) {
      try {
        // Визначаємо розширення з mimetype (наприклад 'image/png' -> 'png')
        const ext = file.mimetype.split('/')[1] || 'jpeg';
        const fileName = `inventory/${uuidv4()}.${ext}`;
        
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            // ACL: 'public-read' не потрібен для Supabase, оскільки бакет уже Public
          })
        );
        
        // Збираємо публічне посилання
        return `${process.env.S3_PUBLIC_URL}/${fileName}`;
      } catch (e) {
        this.logger.error('S3 Upload failed, falling back to base64', e);
      }
    }

    // Fallback: якщо S3 не налаштовано або впало, зберігаємо як раніше
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
      ? await this.uploadImage(params.file)
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