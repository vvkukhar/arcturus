import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ImportCsvDto } from './dto/import-csv.dto';
import { ImportExportService } from './import-export.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('import-export')
export class ImportExportController {
  constructor(private readonly importExportService: ImportExportService) {}

  @Get('export/inventory.csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="inventory.csv"')
  exportInventory(): Promise<string> {
    return this.importExportService.exportInventory();
  }

  @Get('export/sales.csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="sales.csv"')
  exportSales(): Promise<string> {
    return this.importExportService.exportSales();
  }

  @Get('export/expenses.csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="expenses.csv"')
  exportExpenses(): Promise<string> {
    return this.importExportService.exportExpenses();
  }

  @Get('export/watchlist.csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="watchlist.csv"')
  exportWatchlist(): Promise<string> {
    return this.importExportService.exportWatchlist();
  }

  @Post('import/items')
  importItems(@Body() body: ImportCsvDto): Promise<unknown> {
    return this.importExportService.importItems(body.csv, body.dryRun ?? false);
  }

  @Post('import/expenses')
  importExpenses(@Body() body: ImportCsvDto): Promise<unknown> {
    return this.importExportService.importExpenses(body.csv, body.dryRun ?? false);
  }
}