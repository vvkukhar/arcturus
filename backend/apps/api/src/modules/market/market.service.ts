import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class MarketService {
 constructor(private readonly prisma: PrismaService) {}
 async getLatestSnapshot(itemId: string): Promise<unknown> {
 const snapshot = await this.prisma.marketSnapshot.findFirst({
 where: { itemId },
 orderBy: {
 computedAt: 'desc',
 },
 });
 if (!snapshot) {
 throw new NotFoundException('Market snapshot not found');
 }
 return snapshot;
 }
 async getListings(itemId: string): Promise<unknown[]> {
 return this.prisma.marketListing.findMany({
 where: { itemId },
 orderBy: {
 fetchedAt: 'desc',
 },
 take: 100,
 });
 }
}