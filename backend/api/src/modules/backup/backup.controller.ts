import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BackupService } from './backup.service';
import { CreateBackupDto } from './dto/create-backup.dto';
import { RestoreBackupDto } from './dto/restore-backup.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  create(@Body() body: CreateBackupDto): Promise<unknown> {
    return this.backupService.create(body);
  }

  @Get()
  list(): Promise<unknown[]> {
    return this.backupService.list();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<unknown> {
    return this.backupService.getById(id);
  }

  @Patch('restore')
  restore(@Body() body: RestoreBackupDto): Promise<unknown> {
    return this.backupService.restore(body);
  }
}