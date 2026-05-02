import { Injectable } from '@nestjs/common';

export type DailyPlanInput = {
  buyCount: number;
  sellCount: number;
  reviewCount: number;
  unresolvedCount: number;
  staleSources: number;
};

export type DailyPlanTask = {
  order: number;
  type: 'buy' | 'sell' | 'review' | 'sync' | 'operator' | 'admin';
  title: string;
  reason: string;
};

@Injectable()
export class DailyPlanService {
  generate(input: DailyPlanInput): DailyPlanTask[] {
    const tasks: DailyPlanTask[] = [];

    if (input.unresolvedCount > 0) {
      tasks.push({
        order: 0,
        type: 'operator',
        title: `Resolve ${input.unresolvedCount} unresolved matches`,
        reason: 'Unresolved listings block market intelligence accuracy',
      });
    }

    if (input.buyCount > 0) {
      tasks.push({
        order: 0,
        type: 'buy',
        title: `Check ${input.buyCount} purchase flow items`,
        reason: 'Buy opportunities lose value fastest',
      });
    }

    if (input.sellCount > 0) {
      tasks.push({
        order: 0,
        type: 'sell',
        title: `Process ${input.sellCount} reprice/listing tasks`,
        reason: 'Inventory needs active conversion into cashflow',
      });
    }

    if (input.reviewCount > 0) {
      tasks.push({
        order: 0,
        type: 'review',
        title: `Review ${input.reviewCount} manual items`,
        reason: 'Manual review prevents bad automated decisions',
      });
    }

    if (input.staleSources > 0) {
      tasks.push({
        order: 0,
        type: 'sync',
        title: `Refresh ${input.staleSources} stale sources`,
        reason: 'Fresh listings improve pricing and deal detection',
      });
    }

    if (tasks.length === 0) {
      tasks.push({
        order: 0,
        type: 'admin',
        title: 'System is clean — add inventory or expand watchlist',
        reason: 'No urgent execution pressure detected',
      });
    }

    return tasks
      .sort((a, b) => {
        const priority: Record<DailyPlanTask['type'], number> = {
          operator: 1,
          buy: 2,
          sell: 3,
          review: 4,
          sync: 5,
          admin: 6,
        };

        return priority[a.type] - priority[b.type];
      })
      .map((task, index) => ({
        ...task,
        order: index + 1,
      }));
  }
}