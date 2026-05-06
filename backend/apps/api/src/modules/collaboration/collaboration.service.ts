import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class CollaborationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async getUsers(): Promise<unknown[]> {
    return this.prisma.user.findMany({
      orderBy: [
        {
          active: 'desc',
        },
        {
          createdAt: 'asc',
        },
      ],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });
  }

  async createUser(body: {
    name: string;
    email?: string | null;
    role?: string | null;
  }): Promise<unknown> {
    const name = body.name?.trim();

    if (!name) {
      throw new BadRequestException('Name is required');
    }

    const created = await this.prisma.user.create({
      data: {
        name,
        email: body.email?.trim() || null,
        role: body.role ?? 'operator',
        active: true,
      },
    });

    this.realtime.emitCustom('user_created', created);

    return created;
  }

  async updateUser(body: {
    id: string;
    name?: string;
    email?: string | null;
    role?: string;
    active?: boolean;
  }): Promise<unknown> {
    const existing = await this.prisma.user.findUnique({
      where: {
        id: body.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        active: body.active,
      },
    });

    this.realtime.emitCustom('user_updated', updated);

    return updated;
  }

  async assignInventory(body: {
    inventoryItemId: string;
    userId: string | null;
  }): Promise<unknown> {
    const inventory = await this.prisma.inventoryItem.findUnique({
      where: {
        id: body.inventoryItemId,
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    if (body.userId) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: body.userId,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    const updated = await this.prisma.inventoryItem.update({
      where: {
        id: body.inventoryItemId,
      },
      data: {
        assignedUserId: body.userId,
      },
      include: {
        item: true,
        assignedUser: true,
      },
    });

    this.realtime.emitCustom('assignment.inventory_updated', {
      inventoryItemId: body.inventoryItemId,
      userId: body.userId,
    });

    this.realtime.emitInventoryRefresh(updated);

    return updated;
  }

  async assignWatchlist(body: {
    watchlistItemId: string;
    userId: string | null;
  }): Promise<unknown> {
    const watchlist = await this.prisma.watchlistItem.findUnique({
      where: {
        id: body.watchlistItemId,
      },
    });

    if (!watchlist) {
      throw new NotFoundException('Watchlist item not found');
    }

    if (body.userId) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: body.userId,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    const updated = await this.prisma.watchlistItem.update({
      where: {
        id: body.watchlistItemId,
      },
      data: {
        assignedUserId: body.userId,
      },
      include: {
        item: true,
        assignedUser: true,
      },
    });

    this.realtime.emitCustom('assignment.watchlist_updated', {
      watchlistItemId: body.watchlistItemId,
      userId: body.userId,
    });

    this.realtime.emitWatchlistRefresh(updated);

    return updated;
  }

  async getAssignments(): Promise<{
    inventory: unknown[];
    watchlist: unknown[];
  }> {
    const [inventory, watchlist] = await Promise.all([
      this.prisma.inventoryItem.findMany({
        where: {
          assignedUserId: {
            not: null,
          },
        },
        include: {
          item: true,
          assignedUser: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      this.prisma.watchlistItem.findMany({
        where: {
          assignedUserId: {
            not: null,
          },
        },
        include: {
          item: true,
          assignedUser: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
    ]);

    return {
      inventory,
      watchlist,
    };
  }

  async getUserWorkload(userId: string): Promise<unknown> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [
      inventoryAssigned,
      watchlistAssigned,
      unreadNotifications,
      pendingInventory,
      pendingWatchlist,
    ] = await Promise.all([
      this.prisma.inventoryItem.count({
        where: {
          assignedUserId: userId,
        },
      }),
      this.prisma.watchlistItem.count({
        where: {
          assignedUserId: userId,
        },
      }),
      this.prisma.notification.count({
        where: {
          targetUserId: userId,
          read: false,
        },
      }),
      this.prisma.repriceFlowItem.count({
        where: {
          inventoryItem: {
            assignedUserId: userId,
          },
          status: 'pending',
        },
      }),
      this.prisma.purchaseFlowItem.count({
        where: {
          watchlistItem: {
            assignedUserId: userId,
          },
          status: 'pending',
        },
      }),
    ]);

    return {
      user,
      inventoryAssigned,
      watchlistAssigned,
      unreadNotifications,
      pendingInventory,
      pendingWatchlist,
      totalAssigned: inventoryAssigned + watchlistAssigned,
      totalPending: pendingInventory + pendingWatchlist,
    };
  }

  async getTeamWorkload(): Promise<unknown[]> {
    const users = await this.prisma.user.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return Promise.all(users.map((user) => this.getUserWorkload(user.id)));
  }
}