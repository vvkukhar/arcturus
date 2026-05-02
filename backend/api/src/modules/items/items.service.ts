import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { ActivityService } from '../activity/activity.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly activity: ActivityService,
  ) {}

  async list(params?: {
    q?: string;
    kind?: string;
    theme?: string;
    limit?: number;
  }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.item.findMany({
      where: {
        ...(params?.kind && params.kind !== 'all'
          ? {
              kind: params.kind,
            }
          : {}),
        ...(params?.theme
          ? {
              theme: {
                contains: params.theme,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(q
          ? {
              OR: [
                {
                  title: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  setNumber: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  theme: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [
        {
          theme: 'asc',
        },
        {
          title: 'asc',
        },
      ],
      take: params?.limit ?? 100,
    });
  }

  async getById(id: string): Promise<unknown> {
    const item = await this.prisma.item.findUnique({
      where: {
        id,
      },
      include: {
        inventoryItems: {
          include: {
            images: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        watchlistItems: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        marketSnapshots: {
          orderBy: {
            computedAt: 'desc',
          },
          take: 20,
        },
        marketListings: {
          orderBy: {
            fetchedAt: 'desc',
          },
          take: 50,
          include: {
            source: true,
          },
        },
        decisionSnapshots: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async create(dto: CreateItemDto): Promise<unknown> {
    const title = dto.title?.trim();

    if (!title) {
      throw new BadRequestException('Title is required');
    }

    if (dto.setNumber) {
      const existing = await this.prisma.item.findFirst({
        where: {
          setNumber: dto.setNumber,
        },
      });

      if (existing) {
        throw new BadRequestException('Item with this set number already exists');
      }
    }

    const created = await this.prisma.item.create({
      data: {
        title,
        setNumber: dto.setNumber?.trim() || null,
        theme: dto.theme?.trim() || null,
        kind: dto.kind ?? 'set',
        conditionDefault: dto.conditionDefault ?? 'used',
        imageUrl: dto.imageUrl ?? null,
        notes: dto.notes ?? null,
      },
    });

    await this.activity.log('item.created', {
      itemId: created.id,
      title: created.title,
      setNumber: created.setNumber,
    });

    this.realtime.emitItemRefresh(created.id, 'item_created');
    this.realtime.emitDashboardRefresh('item_created');

    return created;
  }

  async update(dto: UpdateItemDto): Promise<unknown> {
    const existing = await this.prisma.item.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Item not found');
    }

    if (dto.setNumber && dto.setNumber !== existing.setNumber) {
      const conflict = await this.prisma.item.findFirst({
        where: {
          setNumber: dto.setNumber,
          id: {
            not: dto.id,
          },
        },
      });

      if (conflict) {
        throw new BadRequestException('Item with this set number already exists');
      }
    }

    const updated = await this.prisma.item.update({
      where: {
        id: dto.id,
      },
      data: {
        title: dto.title,
        setNumber: dto.setNumber,
        theme: dto.theme,
        kind: dto.kind,
        conditionDefault: dto.conditionDefault,
        imageUrl: dto.imageUrl,
        notes: dto.notes,
      },
    });

    await this.activity.log('item.updated', {
      itemId: updated.id,
      title: updated.title,
      setNumber: updated.setNumber,
    });

    this.realtime.emitItemRefresh(updated.id, 'item_updated');
    this.realtime.emitDashboardRefresh('item_updated');
    this.realtime.emitOpportunityRefresh('item_updated');

    return updated;
  }

  async delete(id: string): Promise<unknown> {
    const existing = await this.prisma.item.findUnique({
      where: {
        id,
      },
      include: {
        inventoryItems: {
          select: {
            id: true,
          },
        },
        watchlistItems: {
          select: {
            id: true,
          },
        },
        marketListings: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Item not found');
    }

    if (
      existing.inventoryItems.length > 0 ||
      existing.watchlistItems.length > 0 ||
      existing.marketListings.length > 0
    ) {
      throw new BadRequestException(
        'Cannot delete item with inventory/watchlist/listing references',
      );
    }

    const deleted = await this.prisma.item.delete({
      where: {
        id,
      },
    });

    await this.activity.log('item.deleted', {
      itemId: id,
      title: existing.title,
    });

    this.realtime.emitItemRefresh(id, 'item_deleted');
    this.realtime.emitDashboardRefresh('item_deleted');

    return deleted;
  }

  async themes(): Promise<string[]> {
    const rows = await this.prisma.item.findMany({
      where: {
        theme: {
          not: null,
        },
      },
      select: {
        theme: true,
      },
      distinct: ['theme'],
      orderBy: {
        theme: 'asc',
      },
    });

    return rows
      .map((row) => row.theme)
      .filter((theme): theme is string => Boolean(theme));
  }

  async stats(): Promise<unknown> {
    const [total, sets, minifigures, bundles, unknown, themes] =
      await Promise.all([
        this.prisma.item.count(),
        this.prisma.item.count({
          where: {
            kind: 'set',
          },
        }),
        this.prisma.item.count({
          where: {
            kind: 'minifigure',
          },
        }),
        this.prisma.item.count({
          where: {
            kind: 'bundle',
          },
        }),
        this.prisma.item.count({
          where: {
            kind: 'unknown',
          },
        }),
        this.themes(),
      ]);

    return {
      total,
      sets,
      minifigures,
      bundles,
      unknown,
      themes: themes.length,
    };
  }
}