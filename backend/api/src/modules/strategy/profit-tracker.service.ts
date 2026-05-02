import { Injectable } from '@nestjs/common';
import {
  addMoney,
  calculateProfit,
  calculateRoiPercent,
} from '../../common/money.utils';

export type ProfitTrackerTrade = {
  buyCost: number;
  sellRevenue: number;
  fees: number;
  shipping: number;
  packaging: number;
};

export type ProfitTrackerResult = {
  totalBuyCost: number;
  totalRevenue: number;
  totalFees: number;
  totalOverhead: number;
  netProfit: number;
  roiPercent: number;
};

@Injectable()
export class ProfitTrackerService {
  summarize(trades: ProfitTrackerTrade[]): ProfitTrackerResult {
    const totalBuyCost = addMoney(...trades.map((trade) => trade.buyCost));
    const totalRevenue = addMoney(...trades.map((trade) => trade.sellRevenue));
    const totalFees = addMoney(...trades.map((trade) => trade.fees));
    const totalOverhead = addMoney(
      ...trades.map((trade) => trade.shipping + trade.packaging),
    );

    const netProfit = calculateProfit({
      revenue: totalRevenue,
      cost: addMoney(totalBuyCost, totalFees, totalOverhead),
    });

    const roiPercent = calculateRoiPercent({
      profit: netProfit,
      cost: totalBuyCost,
    });

    return {
      totalBuyCost,
      totalRevenue,
      totalFees,
      totalOverhead,
      netProfit,
      roiPercent,
    };
  }
}