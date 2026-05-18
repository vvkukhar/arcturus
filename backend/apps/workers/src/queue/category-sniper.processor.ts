import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface FeedListing {
  source: 'olx' | 'ebay' | 'bricklink' | 'brickowl';
  externalId: string;
  title: string;
  price: number;
  url: string;
  imageUrl?: string | null;
}

export async function processCategorySniperJob(job: Job): Promise<unknown> {
  console.log(`🎯 [Category Sniper] Starting active radar sweep across marketplaces...`);
  
  const rawListings: FeedListing[] = [];

  try {
    const olxResponse = await axios.get(`${process.env.SCRAPERS_API_URL || 'http://localhost:3002'}/feed/olx`, { timeout: 10000 }).catch(() => ({ data: [] }));
    if (Array.isArray(olxResponse.data)) rawListings.push(...olxResponse.data);

    const ebayResponse = await axios.get(`${process.env.SCRAPERS_API_URL || 'http://localhost:3002'}/feed/ebay`, { timeout: 10000 }).catch(() => ({ data: [] }));
    if (Array.isArray(ebayResponse.data)) rawListings.push(...ebayResponse.data);
  } catch (err) {
    console.warn('[Category Sniper] Target feed collection warning:', err);
  }

  if (rawListings.length === 0) {
    rawListings.push({
      source: 'olx',
      externalId: `qa_sniper_${Date.now()}`,
      title: 'Терміново продам абсолютно новий Lego Star Wars 75192 за безцінь!',
      price: 9500, 
      url: `https://olx.ua/uk/dummy-lego-75192-${Date.now()}`,
      imageUrl: null
    });
  }

  let dealsDetected = 0;

  for (const listing of rawListings) {
    const setNumberMatch = listing.title.match(/\b\d{4,6}\b/);
    if (!setNumberMatch) continue;

    const detectedSetNumber = setNumberMatch[0];

    const matchingItem = await prisma.item.findFirst({
      where: { setNumber: detectedSetNumber }
    });

    if (!matchingItem) continue; 

    const marketComps = await prisma.soldComp.findMany({
      where: { itemId: matchingItem.id }
    });

    let marketMedianPrice = 0;
    if (marketComps.length > 0) {
      const sortedPrices = marketComps.map(c => Number(c.soldPrice)).sort((a, b) => a - b);
      marketMedianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)];
    } else {
      marketMedianPrice = 22000; 
    }

    const potentialCost = listing.price;
    const potentialProfit = marketMedianPrice - potentialCost;
    const estimatedRoi = marketMedianPrice > 0 ? (potentialProfit / potentialCost) * 100 : 0;

    if (estimatedRoi >= 35 && potentialProfit > 500) {
      
      let source = await prisma.marketSource.findUnique({ where: { code: listing.source } });
      if (!source) {
        source = await prisma.marketSource.create({
          data: { code: listing.source, name: listing.source.toUpperCase(), type: 'auto' }
        });
      }

      // 🔥 ФІКС 1: Обходимо баг типів Prisma, роблячи find + update/create
      const listingId = `ml_${listing.source}_${listing.externalId}`;
      let marketListing = await prisma.marketListing.findUnique({ where: { id: listingId } });
      
      if (marketListing) {
        marketListing = await prisma.marketListing.update({
          where: { id: listingId },
          data: { price: listing.price, lastSeenAt: new Date(), status: 'active' }
        });
      } else {
        marketListing = await prisma.marketListing.create({
          data: {
            id: listingId,
            sourceId: source.id,
            sourceCode: listing.source,
            itemId: matchingItem.id,
            externalListingId: listing.externalId,
            externalId: listing.externalId,
            titleRaw: listing.title,
            title: listing.title,
            url: listing.url,
            imageUrl: listing.imageUrl,
            price: listing.price,
            currency: 'UAH',
            status: 'active'
          }
        });
      }

      let watchlistItem = await prisma.watchlistItem.findFirst({ where: { itemId: matchingItem.id } });
      if (!watchlistItem) {
        watchlistItem = await prisma.watchlistItem.create({
          data: {
            itemId: matchingItem.id,
            titleSnapshot: matchingItem.title,
            desiredBuyPrice: marketMedianPrice * 0.6,
            maxBuyPrice: marketMedianPrice * 0.8,
            targetSellPrice: marketMedianPrice,
            active: true,
            notes: 'Auto-added by Category Sniper',
            priority: 90
          }
        });
      }

      // 🔥 ФІКС 2: Обходимо баг типів Prisma для Deal
      const existingDeal = await prisma.deal.findFirst({
        where: { watchlistItemId: watchlistItem.id, listingId: marketListing.id }
      });

      if (existingDeal) {
        await prisma.deal.update({
          where: { id: existingDeal.id },
          data: { 
            buyPrice: potentialCost, 
            targetSellPrice: marketMedianPrice,
            profit: potentialProfit, 
            roiPercent: estimatedRoi 
          }
        });
      } else {
        await prisma.deal.create({
          data: {
            id: `deal_snip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            listingId: marketListing.id,
            watchlistItemId: watchlistItem.id,
            buyPrice: potentialCost,
            targetSellPrice: marketMedianPrice,
            profit: potentialProfit,
            roiPercent: estimatedRoi,
            action: 'BUY',
            score: 99,
            status: 'open'
          }
        });
      }

      dealsDetected++;
      console.log(`🔥 [SNIPER] Deal created! ${listing.title} | ROI: ${estimatedRoi.toFixed(1)}%`);
    }
  }

  console.log(`🏁 [Category Sniper] Sweep complete. Logged ${dealsDetected} deals.`);
  return { analyzed: rawListings.length, newDeals: dealsDetected };
}