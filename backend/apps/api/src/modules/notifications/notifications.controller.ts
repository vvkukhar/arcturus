import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Roles('admin', 'operator', 'viewer')
  @Get()
  list(
    @CurrentUser() user: CurrentUserPayload,
    @Query('mine') mine?: string,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.notificationsService.list({
      targetUserId: mine === 'true' ? user.id : undefined,
      unreadOnly: unreadOnly === 'true',
      limit: limit ? Number(limit) : 50,
    });
  }

  @Roles('admin', 'operator', 'viewer')
  @Get('unread-count')
  unreadCount(
    @CurrentUser() user: CurrentUserPayload,
    @Query('mine') mine?: string,
  ): Promise<{ unread: number }> {
    return this.notificationsService.unreadCount(
      mine === 'true' ? user.id : undefined,
    );
  }

  @Roles('admin', 'operator', 'viewer')
  @Patch('read')
  markRead(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.notificationsService.markAsRead(body.id);
  }

  @Roles('admin', 'operator', 'viewer')
  @Patch('read-all')
  markAllRead(
    @CurrentUser() user: CurrentUserPayload,
    @Query('mine') mine?: string,
  ): Promise<unknown> {
    return this.notificationsService.markAllRead(
      mine === 'true' ? user.id : undefined,
    );
  }
}