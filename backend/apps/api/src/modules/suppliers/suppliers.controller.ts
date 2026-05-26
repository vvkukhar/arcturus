import { Controller, Get, Param, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SuppliersService } from './suppliers.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  list(@Query('status') status?: string) {
    return this.suppliersService.listSuppliers({ status });
  }

  @Patch(':id/trusted')
  markTrusted(@Param('id') id: string, @Body() body: { notes?: string }) {
    return this.suppliersService.markTrusted(id, body.notes);
  }

  @Patch(':id/scammer')
  markScammer(@Param('id') id: string, @Body() body: { notes?: string }) {
    return this.suppliersService.markScammer(id, body.notes);
  }
}