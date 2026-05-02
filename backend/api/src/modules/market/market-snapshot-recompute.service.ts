import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class MarketSnapshotRecomputeService {
 constructor(private readonly prisma: PrismaService) {}
 async recomputeForItem(itemId: string, scope = 'ua'): Promise<unknown> {
 const listings = await this.prisma.marketListing.findMany({
 where: {
 itemId,
 status: 'active',
 },
 orderBy: {
 fetchedAt: 'desc',
 },
 });
 if (listings.length === 0) {
 return this.prisma.marketSnapshot.create({
 data: {
 itemId,
 scope,
 listingsCount: 0,
 confidenceScore: 0,
 },
 });
 }
 const prices = listings
 .map((item) => item.price)
 .filter((value) => value !== null)
 .sort((a, b) => a - b);
 const pricesWithShipping = listings
 .map((item) => item.price + (item.shippingPrice ?? 0))
 .sort((a, b) => a - b);
 const shippingValues = listings
 .map((item) => item.shippingPrice ?? 0)
 .sort((a, b) => a - b);
 const usedListings = listings.filter((item) => item.sealed !== true);
 const sealedListings = listings.filter((item) => item.sealed === true);
 const avg = (values: number[]): number | null => {
 if (values.length === 0) return null;
 return values.reduce((sum, value) => sum + value, 0) / values.length;
 };
 const median = (values: number[]): number | null => {
 if (values.length === 0) return null;
 const mid = Math.floor(values.length / 2);
 return values.length % 2 === 0
 ? (values[mid - 1] + values[mid]) / 2
 : values[mid];
 };
 const confidenceScore =
 listings.length >= 10 ? 0.95 : listings.length >= 5 ? 0.8 : listings.length >= 2 ? 0.65 : 0.45;
 return this.prisma.marketSnapshot.create({
 data: {
 itemId,
 scope,
 listingsCount: listings.length,
 lowestPrice: prices[0] ?? null,
 lowestPriceWithShipping: pricesWithShipping[0] ?? null,
 avgPrice: avg(prices),
 medianPrice: median(prices),
 avgShipping: avg(shippingValues),
 minShipping: shippingValues[0] ?? null,
 maxShipping: shippingValues[shippingValues.length - 1] ?? null,
 sealedAvgPrice: avg(sealedListings.map((item) => item.price)),
 usedAvgPrice: avg(usedListings.map((item) => item.price)),
 confidenceScore,
 },
 });
 }
}