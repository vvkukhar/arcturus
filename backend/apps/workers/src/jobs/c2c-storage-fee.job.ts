import { prisma } from '../prisma';
import { toMoney } from '@arcturus/shared';

export async function c2cStorageFeeJob(): Promise<{ penalizedCount: number; totalExtracted: number }> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const staleListings = await prisma.inventoryItem.findMany({
    where: {
      quantity: { gt: 0 },
      isMarketplace: true,
      approvalStatus: 'approved',
      updatedAt: { lt: thirtyDaysAgo },
    },
    include: { seller: true }
  });

  let penalizedCount = 0;
  let totalExtracted = 0;
  const dbOperations = [];

  for (const listing of staleListings) {
    if (!listing.sellerId || !listing.expectedSalePriceManual) continue;

    const penaltyFee = toMoney(listing.expectedSalePriceManual * 0.005); 
    if (penaltyFee <= 0) continue;

    const newPayout = toMoney((listing.sellerPayout || listing.expectedSalePriceManual) - penaltyFee);
    const newCommissionRate = toMoney(listing.commissionRate + 0.5);

    if (newPayout < listing.expectedSalePriceManual * 0.5) continue; 

    dbOperations.push(
      prisma.inventoryItem.update({
        where: { id: listing.id },
        data: {
          sellerPayout: newPayout,
          commissionRate: newCommissionRate,
          updatedAt: new Date(),
        }
      }),
      prisma.payoutRequest.create({
        data: {
          sellerId: listing.sellerId,
          amount: -penaltyFee,
          status: 'paid',
          adminNote: `System Deduction: Inactivity penalty (0.5%) for listing ${listing.id}`,
        }
      }),
      prisma.activityLog.create({
        data: {
          action: 'monetization.c2c_storage_fee_applied',
          payloadJson: {
            inventoryItemId: listing.id,
            sellerId: listing.sellerId,
            penaltyFee,
            newPayout
          }
        }
      })
    );

    penalizedCount++;
    totalExtracted += penaltyFee;
  }

  if (dbOperations.length > 0) {
    const chunkSize = 100;
    for (let i = 0; i < dbOperations.length; i += chunkSize) {
      await prisma.$transaction(dbOperations.slice(i, i + chunkSize));
    }
  }

  return { penalizedCount, totalExtracted: toMoney(totalExtracted) };
}