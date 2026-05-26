import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async getSupplier(sourceCode: string, externalId: string) {
    let supplier = await this.prisma.supplierProfile.findUnique({
      where: { sourceCode_externalId: { sourceCode, externalId } }
    });

    if (!supplier) {
      supplier = await this.prisma.supplierProfile.create({
        data: { sourceCode, externalId }
      });
    }
    return supplier;
  }

  async markTrusted(id: string, notes?: string) {
    return this.prisma.supplierProfile.update({
      where: { id },
      data: { status: 'trusted', trustScore: 100, notes }
    });
  }

  async markScammer(id: string, notes?: string) {
    return this.prisma.supplierProfile.update({
      where: { id },
      data: { status: 'blacklisted', trustScore: 0, fraudCount: { increment: 1 }, notes }
    });
  }

  async listSuppliers(params: { status?: string; limit?: number }) {
    return this.prisma.supplierProfile.findMany({
      where: params.status && params.status !== 'all' ? { status: params.status } : {},
      orderBy: { trustScore: 'desc' },
      take: params.limit ?? 100,
    });
  }
}