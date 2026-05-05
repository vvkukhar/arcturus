export type UserRole = 'admin' | 'operator' | 'viewer';

export interface User {
  id: string;
  name: string;
  email?: string | null;
  role: UserRole;
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
  images?: InventoryImage[];
  assignedUser?: User | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  order?: number;
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

export interface OpportunityItem {
  itemId: string;
  watchlistItemId?: string;
  inventoryItemId?: string;
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
}

export interface DashboardExecutionSummary {
  purchasePending: number;
  purchaseBought: number;
  repricePending: number;
  repriceListed: number;
  reviewPending: number;
  reviewDone: number;
  headline: string;
}

export interface DashboardFlowCounters {
  purchase: number;
  reprice: number;
  review: number;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export type ReserveStatus = 'pending' | 'approved' | 'rejected' | 'contacted';

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

export interface PurchaseFlowItem {
  id: string;
  watchlistItemId: string;
  selectedPrice: number;
  status: string;
  createdAt?: string;
}

export interface RepriceFlowItem {
  id: string;
  inventoryItemId: string;
  currentPrice?: number | null;
  suggestedPrice?: number | null;
  status: string;
}

export interface ReviewFlowItem {
  id: string;
  inventoryItemId: string;
  status: string;
  reason?: string | null;
}

export interface DealItem {
  id: string;
  action: string;
  buyPrice?: number;
  targetSellPrice?: number;
  roiPercent?: number;
  listing?: { title?: string; sourceCode?: string };
  watchlistItem?: { titleSnapshot?: string };
}

export interface DailyPlanTask {
  order: number;
  type: string;
  title: string;
  reason: string;
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
}

export interface SalesStats {
  totalProfit: number;
  salesCount: number;
}