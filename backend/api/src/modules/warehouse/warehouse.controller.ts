import {
  Body,
  Controller,
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
import { CreateStorageLocationDto } from './dto/create-storage-location.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { MoveInventoryDto } from './dto/move-inventory.dto';
import { UpdateStorageLocationDto } from './dto/update-storage-location.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseService } from './warehouse.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  listWarehouses(): Promise<unknown[]> {
    return this.warehouseService.listWarehouses();
  }

  @Get('snapshot')
  snapshot(): Promise<unknown[]> {
    return this.warehouseService.warehouseSnapshot();
  }

  @Get('locations')
  listLocations(@Query('warehouseId') warehouseId?: string): Promise<unknown[]> {
    return this.warehouseService.listLocations(warehouseId);
  }

  @Get('locations/:id')
  getLocation(@Param('id') id: string): Promise<unknown> {
    return this.warehouseService.getLocation(id);
  }

  @Post('locations')
  createLocation(@Body() body: CreateStorageLocationDto): Promise<unknown> {
    return this.warehouseService.createLocation(body);
  }

  @Patch('locations')
  updateLocation(@Body() body: UpdateStorageLocationDto): Promise<unknown> {
    return this.warehouseService.updateLocation(body);
  }

  @Get('movements')
  movements(@Query('inventoryItemId') inventoryItemId?: string): Promise<unknown[]> {
    return this.warehouseService.movements(inventoryItemId);
  }

  @Patch('move')
  moveInventory(@Body() body: MoveInventoryDto): Promise<unknown> {
    return this.warehouseService.moveInventory(body);
  }

  @Get(':id')
  getWarehouse(@Param('id') id: string): Promise<unknown> {
    return this.warehouseService.getWarehouse(id);
  }

  @Post()
  createWarehouse(@Body() body: CreateWarehouseDto): Promise<unknown> {
    return this.warehouseService.createWarehouse(body);
  }

  @Patch()
  updateWarehouse(@Body() body: UpdateWarehouseDto): Promise<unknown> {
    return this.warehouseService.updateWarehouse(body);
  }
}