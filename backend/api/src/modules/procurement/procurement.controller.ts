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
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { ProcurementService } from './procurement.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get()
  list(
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('assignedUserId') assignedUserId?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.procurementService.list({
      status,
      q,
      assignedUserId,
      limit: limit ? Number(limit) : 200,
    });
  }

  @Get('board')
  board(): Promise<{
    planned: unknown[];
    approved: unknown[];
    ordered: unknown[];
    paid: unknown[];
    received: unknown[];
    cancelled: unknown[];
  }> {
    return this.procurementService.board();
  }

  @Get('stats')
  stats(): Promise<unknown> {
    return this.procurementService.stats();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<unknown> {
    return this.procurementService.getById(id);
  }

  @Post()
  create(@Body() body: CreatePurchaseOrderDto): Promise<unknown> {
    return this.procurementService.create(body);
  }

  @Post('from-watchlist')
  createFromWatchlist(
    @Body()
    body: {
      watchlistItemId: string;
    },
  ): Promise<unknown> {
    return this.procurementService.createFromWatchlist(body.watchlistItemId);
  }

  @Patch()
  update(@Body() body: UpdatePurchaseOrderDto): Promise<unknown> {
    return this.procurementService.update(body);
  }

  @Patch('status')
  updateStatus(
    @Body()
    body: {
      id: string;
      status: string;
    },
  ): Promise<unknown> {
    return this.procurementService.updateStatus(body.id, body.status);
  }

  @Patch('receive')
  receive(@Body() body: ReceivePurchaseOrderDto): Promise<unknown> {
    return this.procurementService.receive(body);
  }
}