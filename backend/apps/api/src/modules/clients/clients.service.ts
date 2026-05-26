import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getClientByPhone(phone: string) {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    return this.prisma.clientProfile.findUnique({
      where: { phone: cleanPhone },
    });
  }

  async listClients(params: { status?: string; limit?: number }) {
    return this.prisma.clientProfile.findMany({
      where: params.status && params.status !== 'all' ? { status: params.status } : {},
      orderBy: { fraudScore: 'desc' },
      take: params.limit ?? 100,
    });
  }

  async updateClientStatus(id: string, status: string, score: number) {
    return this.prisma.clientProfile.update({
      where: { id },
      data: { status, fraudScore: score },
    });
  }
}