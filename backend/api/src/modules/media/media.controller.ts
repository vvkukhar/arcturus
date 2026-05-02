// backend/api/src/modules/media/media.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MediaService, UploadedInventoryImageFile } from './media.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('inventory-image')
  @UseInterceptors(FileInterceptor('file'))
  addInventoryImage(
    @UploadedFile() file: UploadedInventoryImageFile | undefined,
    @Body()
    body: {
      inventoryItemId: string;
      imageUrl?: string;
      altText?: string | null;
    },
  ): Promise<unknown> {
    return this.mediaService.addInventoryImage({
      inventoryItemId: body.inventoryItemId,
      file,
      imageUrl: body.imageUrl,
      altText: body.altText,
    });
  }

  @Delete('inventory-image')
  deleteInventoryImage(@Body() body: { imageId: string }): Promise<unknown> {
    return this.mediaService.deleteInventoryImage(body.imageId);
  }

  @Patch('inventory-image/primary')
  setPrimaryInventoryImage(@Body() body: { imageId: string }): Promise<unknown> {
    return this.mediaService.setPrimaryInventoryImage(body.imageId);
  }

  @Patch('inventory-image/reorder')
  reorderInventoryImages(
    @Body()
    body: {
      inventoryItemId: string;
      imageIds: string[];
    },
  ): Promise<unknown> {
    return this.mediaService.reorderInventoryImages(body);
  }

  @Get('inventory/:inventoryItemId/images')
  listInventoryImages(
    @Param('inventoryItemId') inventoryItemId: string,
  ): Promise<unknown[]> {
    return this.mediaService.listInventoryImages(inventoryItemId);
  }
}