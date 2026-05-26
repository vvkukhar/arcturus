// call:function_1{"queries":["web/lib/types.ts"]}
export type UserRole = 'admin' | 'operator' | 'viewer' | string;

export interface User {
  id: string;
  name: string;
  email?: string | null;
  role: UserRole;
  active?: boolean;
}

export interface InventoryImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  order?: number;
}

export interface InventoryItem {
  id: string;
  itemId: string;
  titleSnapshot: string;
  purchasePrice: number;
  totalCost: number;
  expectedSalePriceManual?: number | null;
  quantity: number;
  condition: string;
  sealed: boolean;
  notes?: string | null;
  source?: string | null;
  purchaseUrl?: string | null;
  images?: InventoryImage[];
  assignedUser?: User | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WatchlistItem {
  id: string;
  itemId: string;
  titleSnapshot: string;
  desiredBuyPrice: number;
  maxBuyPrice: number;
  targetSellPrice?: number | null;
  active: boolean;
  priority: number;
  notes?: string | null;
  assignedUserId?: string | null;
  assignedUser?: User | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export type ReserveStatus = 'pending' | 'approved' | 'rejected' | 'contacted' | 'sold' | 'completed' | string;

export interface ReserveRequest {
  id: string;
  inventoryItemId?: string | null;
  productTitle: string;
  name: string;
  contact: string;
  message?: string | null;
  status: ReserveStatus;
  adminNote?: string | null;
  createdAt?: string;
}

export interface DashboardFlowCounters {
  purchase: number;
  reprice: number;
  review: number;
  unresolved: number;
  orders: number;
  returns: number;
  procurement: number;
  reports: number;
  decisions: number;
}

export interface DashboardExecutionSummary {
  purchasePending: number;
  purchaseBought: number;
  repricePending: number;
  repriceListed: number;
  reviewPending: number;
  reviewDone: number;
  unresolvedPending: number;
  ordersPending: number;
  ordersSold: number;
  returnsOpen: number;
  returnsResolved: number;
  procurementOpen: number;
  procurementReceived: number;
  reportsCount: number;
  latestReportAt: string | null;
  decisionsCount: number;
  latestDecisionAt: string | null;
  buyNowDecisions: number;
  repriceDecisions: number;
  headline: string;
}

export interface DealItem {
  id: string;
  listingId: string;
  watchlistItemId: string;
  buyPrice: number;
  targetSellPrice: number;
  profit: number;
  roiPercent: number;
  action: string;
  score: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseFlowItem {
  id: string;
  watchlistItemId: string;
  selectedPrice?: number | null;
  status: string;
  reason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RepriceFlowItem {
  id: string;
  inventoryItemId: string;
  currentPrice?: number | null;
  suggestedPrice?: number | null;
  status: string;
  reason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewFlowItem {
  id: string;
  inventoryItemId: string;
  status: string;
  reason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScannerSource {
  code: string;
  name: string;
  type: string;
  enabled: boolean;
}

export type ScannerJobStatus = 'queued' | 'running' | 'success' | 'failed' | string;

export interface ScannerJob {
  id: string;
  sourceCode: string;
  query?: string | null;
  status: ScannerJobStatus;
}

export interface SuggestionItem {
  id: string;
  title: string;
  roi: number;
  action: string;
  score?: number;
  suggestion?: string;
}

export interface SalesStats {
  totalProfit: number;
  salesCount: number;
}

export interface DailyPlanTask {
  order: number;
  type: string;
  title: string;
  reason: string;
}

export interface OpportunityItem {
  id: string;
  itemId: string;
  watchlistItemId?: string;
  inventoryItemId?: string;
  title: string;
  sourceCode?: string;
  score: number;
  action: string;
  profit: number;
  roi: number;
  totalBuy?: number;
  totalCostBasis?: number;
  targetSellPrice?: number;
  suggestedSellPrice?: number;
  floorSellPrice?: number;
  stretchSellPrice?: number;
  flipStrategy?: string;
  flipStrategyScore?: number;
  flipStrategyReasonPrimary?: string;
  flipStrategyReasonSecondary?: string;
  actionReasonPrimary?: string;
  actionReasonSecondary?: string;
  bundleDetected?: boolean;
  arbitrageScore?: number | null;
}