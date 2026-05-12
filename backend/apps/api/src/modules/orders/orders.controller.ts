import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  list(@Query('status') status?: string, @Query('q') q?: string, @Query('limit') limit?: string): Promise<unknown[]> {
    return this.ordersService.list({ status, q, limit: limit ? Number(limit) : 200 });
  }

  @Get('board')
  board() {
    return this.ordersService.board();
  }

  @Get('stats')
  stats() {
    return this.ordersService.stats();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.ordersService.getById(id);
  }

  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  @Post('from-reserve')
  createFromReserve(@Body() body: { reserveRequestId: string }) {
    return this.ordersService.createFromReserve(body.reserveRequestId);
  }

  @Patch()
  update(@Body() body: UpdateOrderDto) {
    return this.ordersService.update(body);
  }

  @Patch('status')
  updateStatus(@Body() body: { id: string; status: string }) {
    return this.ordersService.updateStatus(body.id, body.status);
  }

  @Patch('complete-as-sale')
  completeAsSale(@Body() body: { id: string }) {
    return this.ordersService.completeAsSale(body.id);
  }
}