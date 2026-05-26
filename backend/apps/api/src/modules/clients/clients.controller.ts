import { Controller, Get, Param, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ClientsService } from './clients.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  list(@Query('status') status?: string) {
    return this.clientsService.listClients({ status });
  }

  @Get(':phone')
  getByPhone(@Param('phone') phone: string) {
    return this.clientsService.getClientByPhone(phone);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; score: number }) {
    return this.clientsService.updateClientStatus(id, body.status, body.score);
  }
}