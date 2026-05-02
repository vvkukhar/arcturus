import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CollaborationService } from './collaboration.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Roles('admin', 'operator', 'viewer')
  @Get('users')
  getUsers(): Promise<unknown[]> {
    return this.collaborationService.getUsers();
  }

  @Roles('admin')
  @Post('users')
  createUser(
    @Body()
    body: {
      name: string;
      email?: string | null;
      role?: string | null;
    },
  ): Promise<unknown> {
    return this.collaborationService.createUser(body);
  }

  @Roles('admin')
  @Patch('users')
  updateUser(
    @Body()
    body: {
      id: string;
      name?: string;
      email?: string | null;
      role?: string;
      active?: boolean;
    },
  ): Promise<unknown> {
    return this.collaborationService.updateUser(body);
  }

  @Roles('admin', 'operator')
  @Patch('assign/inventory')
  assignInventory(
    @Body()
    body: {
      inventoryItemId: string;
      userId: string | null;
    },
  ): Promise<unknown> {
    return this.collaborationService.assignInventory(body);
  }

  @Roles('admin', 'operator')
  @Patch('assign/watchlist')
  assignWatchlist(
    @Body()
    body: {
      watchlistItemId: string;
      userId: string | null;
    },
  ): Promise<unknown> {
    return this.collaborationService.assignWatchlist(body);
  }

  @Roles('admin', 'operator', 'viewer')
  @Get('assignments')
  getAssignments(): Promise<{
    inventory: unknown[];
    watchlist: unknown[];
  }> {
    return this.collaborationService.getAssignments();
  }

  @Roles('admin', 'operator', 'viewer')
  @Get('workload')
  getTeamWorkload(): Promise<unknown[]> {
    return this.collaborationService.getTeamWorkload();
  }

  @Roles('admin', 'operator', 'viewer')
  @Get('workload/:userId')
  getUserWorkload(@Param('userId') userId: string): Promise<unknown> {
    return this.collaborationService.getUserWorkload(userId);
  }
}