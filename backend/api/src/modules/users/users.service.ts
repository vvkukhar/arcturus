import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async list(params?: {
    q?: string;
    role?: string;
    active?: boolean;
  }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.user.findMany({
      where: {
        role: params?.role,
        active: params?.active,
        OR:
          q && q.length > 0
            ? [
                {
                  name: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              ]
            : undefined,
      },
      orderBy: [
        {
          active: 'desc',
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  async getById(id: string): Promise<unknown> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        assignedInventoryItems: {
          include: {
            item: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        assignedWatchlistItems: {
          include: {
            item: true,
          },
          orderBy: {
            priority: 'desc',
          },
        },
        notifications: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(body: {
    name: string;
    email?: string | null;
    role?: string | null;
  }): Promise<unknown> {
    const name = body.name?.trim();

    if (!name) {
      throw new BadRequestException('User name is required');
    }

    const created = await this.prisma.user.create({
      data: {
        name,
        email: body.email?.trim() || null,
        role: body.role?.trim() || 'operator',
        active: true,
      },
    });

    this.realtime.emitCustom('user_created', created);
    this.realtime.emitDashboardRefresh('user_created');

    return created;
  }

  async update(
    id: string,
    body: {
      name?: string;
      email?: string | null;
      role?: string | null;
      active?: boolean;
    },
  ): Promise<unknown> {
    if (!id) {
      throw new BadRequestException('User id is required');
    }

    const existing = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: body.name?.trim(),
        email:
          body.email === null
            ? null
            : body.email?.trim() || undefined,
        role: body.role?.trim() || undefined,
        active: body.active,
      },
    });

    this.realtime.emitCustom('user_updated', updated);
    this.realtime.emitDashboardRefresh('user_updated');

    return updated;
  }
}