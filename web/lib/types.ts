export type DashboardExecutionSummary = {
  purchasePending: number;
  purchaseBought: number;
  repricePending: number;
  repriceListed: number;
  reviewPending: number;
  reviewDone: number;
  headline: string;
};

export type OpportunityItem = {
  itemId: string;
  title: string;
  score: number;
  action: string;
  actionReasonPrimary: string;
  actionReasonSecondary?: string;
  profit: number;
  roi: number;
  marginPercent?: number;
  totalCostBasis?: number;
  totalBuy?: number;
  targetSellPrice?: number;
  flipStrategy?: string;
  sourceCode?: string;
};

export type DailyPlanTask = {
  order: number;
  type: string;
  title: string;
  reason: string;
};

export type DashboardFlowCounters = {
  purchase: number;
  reprice: number;
  review: number;
};