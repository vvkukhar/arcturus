import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { InventoryService } from './inventory.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  list(
    @Query('q') q?: string,
    @Query('assignedUserId') assignedUserId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string, // ФІКС: Додали підтримку Offset
  ): Promise<unknown[]> {
    return this.inventoryService.list({
      q,
      assignedUserId,
      status,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
    });
  }

  @Get('stats')
  stats(): Promise<unknown> {
    return this.inventoryService.stats();
  }

  @Get('export')
  exportRows(): Promise<unknown[]> {
    return this.inventoryService.exportRows();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<unknown> {
    return this.inventoryService.getById(id);
  }

  @Post()
  create(@Body() body: CreateInventoryItemDto): Promise<unknown> {
    return this.inventoryService.create(body);
  }

  @Patch()
  update(@Body() body: UpdateInventoryItemDto): Promise<unknown> {
    return this.inventoryService.update(body);
  }

  @Delete()
  delete(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.inventoryService.delete(body.id);
  }

  @Patch('bulk-delete')
  bulkDelete(
    @Body()
    body: {
      ids: string[];
    },
  ): Promise<unknown> {
    return this.inventoryService.bulkDelete(body.ids ?? []);
  }
}