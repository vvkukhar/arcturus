export type ID = string;

export type ApiDate = string;

export type UserRole = 'admin' | 'operator' | 'viewer' | string;

export type UserDto = {
  id: ID;
  name: string;
  email?: string | null;
  role: UserRole;
  active: boolean;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};

export type ItemDto = {
  id: ID;
  kind: string;
  title: string;
  setNumber?: string | null;
  theme?: string | null;
  conditionDefault?: string | null;
  imageUrl?: string | null;
  notes?: string | null;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};

export type InventoryItemDto = {
  id: ID;
  itemId: ID;
  titleSnapshot: string;
  purchasePrice: number;
  totalCost: number;
  quantity: number;
  condition: string;
  sealed: boolean;
  expectedSalePriceManual?: number | null;
  source?: string | null;
  purchaseUrl?: string | null;
  storageLocation?: string | null;
  storageLocationId?: ID | null;
  warehouseId?: ID | null;
  notes?: string | null;
  priority: number;
  assignedUserId?: ID | null;
  createdAt: ApiDate;
  updatedAt: ApiDate;
  item?: ItemDto;
  assignedUser?: UserDto | null;
};

export type WatchlistItemDto = {
  id: ID;
  itemId: ID;
  titleSnapshot: string;
  desiredBuyPrice: number;
  maxBuyPrice: number;
  targetSellPrice?: number | null;
  active: boolean;
  priority: number;
  notes?: string | null;
  assignedUserId?: ID | null;
  createdAt: ApiDate;
  updatedAt: ApiDate;
  item?: ItemDto;
  assignedUser?: UserDto | null;
};

export type WarehouseDto = {
  id: ID;
  code: string;
  name: string;
  address?: string | null;
  active: boolean;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};

export type StorageLocationDto = {
  id: ID;
  warehouseId: ID;
  code: string;
  name: string;
  zone?: string | null;
  shelf?: string | null;
  box?: string | null;
  active: boolean;
  createdAt: ApiDate;
  updatedAt: ApiDate;
  warehouse?: WarehouseDto;
};

export type OrderDto = {
  id: ID;
  reserveRequestId?: ID | null;
  inventoryItemId?: ID | null;
  saleId?: ID | null;
  productTitle: string;
  buyerName: string;
  contact: string;
  status: string;
  sellPrice?: number | null;
  quantity: number;
  channel?: string | null;
  adminNote?: string | null;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};

export type SaleDto = {
  id: ID;
  inventoryItemId: ID;
  itemId: ID;
  quantity: number;
  sellPrice: number;
  costBasis: number;
  profit: number;
  roiPercent: number;
  channel?: string | null;
  buyerName?: string | null;
  notes?: string | null;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};

export type ReturnRequestDto = {
  id: ID;
  saleId: ID;
  orderId?: ID | null;
  inventoryItemId: ID;
  status: string;
  reason?: string | null;
  refundAmount?: number | null;
  restock: boolean;
  quantity: number;
  adminNote?: string | null;
  resolvedAt?: ApiDate | null;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};

export type ExpenseDto = {
  id: ID;
  type: string;
  category: string;
  amount: number;
  currency: string;
  description?: string | null;
  inventoryItemId?: ID | null;
  purchaseOrderId?: ID | null;
  saleId?: ID | null;
  orderId?: ID | null;
  assignedUserId?: ID | null;
  incurredAt: ApiDate;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};

export type PurchaseOrderDto = {
  id: ID;
  itemId: ID;
  watchlistItemId?: ID | null;
  inventoryItemId?: ID | null;
  assignedUserId?: ID | null;
  titleSnapshot: string;
  sourceCode?: string | null;
  supplierName?: string | null;
  sourceUrl?: string | null;
  status: string;
  plannedPrice?: number | null;
  actualPrice?: number | null;
  shippingPrice?: number | null;
  totalCost?: number | null;
  targetSellPrice?: number | null;
  quantity: number;
  condition: string;
  sealed: boolean;
  notes?: string | null;
  purchasedAt?: ApiDate | null;
  receivedAt?: ApiDate | null;
  createdAt: ApiDate;
  updatedAt: ApiDate;
};

export type DecisionSnapshotDto = {
  id: ID;
  itemId: ID;
  contextType: string;
  contextId: string;
  action: string;
  score: number;
  confidence: number;
  reasonPrimary: string;
  reasonSecondary?: string | null;
  payloadJson?: unknown;
  executionStatus: string;
  executedAt?: ApiDate | null;
  ignoredAt?: ApiDate | null;
  createdAt: ApiDate;
  item?: ItemDto;
};

export type ReportSnapshotDto = {
  id: ID;
  type: string;
  periodStart: ApiDate;
  periodEnd: ApiDate;
  payloadJson: unknown;
  createdAt: ApiDate;
};

export type BackupSnapshotDto = {
  id: ID;
  type: string;
  status: string;
  payloadJson?: unknown;
  notes?: string | null;
  createdAt: ApiDate;
};

export type AuditLogDto = {
  id: ID;
  actorUserId?: ID | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  beforeJson?: unknown;
  afterJson?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: ApiDate;
  actor?: UserDto | null;
};

export type DashboardDto = {
  flowCounters: Record<string, number>;
  executionSummary: Record<string, unknown>;
  businessSnapshot: Record<string, unknown>;
  marketSnapshot: Record<string, unknown>;
  recentActivity: unknown[];
};

export type PnlDto = {
  period: {
    from: ApiDate;
    to: ApiDate;
  };
  revenue: {
    grossRevenue: number;
    refunds: number;
    netRevenue: number;
  };
  costs: {
    cogs: number;
    operatingExpenses: number;
    procurementCommitted: number;
  };
  profit: {
    grossProfit: number;
    netProfitBeforeExpenses: number;
    netProfit: number;
    marginPercent: number;
    roiPercent: number;
  };
  counters: {
    sales: number;
    returns: number;
    expenses: number;
    purchaseOrders: number;
  };
};

export type LoginResponseDto = {
  token: string;
  user: UserDto;
};

export type CreateItemDto = {
  title: string;
  setNumber?: string | null;
  theme?: string | null;
  kind?: string;
  conditionDefault?: string | null;
  imageUrl?: string | null;
  notes?: string | null;
};

export type CreateInventoryItemDto = {
  itemId: ID;
  titleSnapshot: string;
  purchasePrice: number;
  totalCost: number;
  quantity?: number;
  condition?: string;
  sealed?: boolean;
  expectedSalePriceManual?: number | null;
  source?: string | null;
  purchaseUrl?: string | null;
  storageLocation?: string | null;
  storageLocationId?: ID | null;
  warehouseId?: ID | null;
  notes?: string | null;
  priority?: number;
  assignedUserId?: ID | null;
};

export type CreateWatchlistItemDto = {
  itemId: ID;
  titleSnapshot: string;
  desiredBuyPrice: number;
  maxBuyPrice: number;
  targetSellPrice?: number | null;
  active?: boolean;
  priority?: number;
  notes?: string | null;
  assignedUserId?: ID | null;
};

export type CreateOrderDto = {
  inventoryItemId?: ID | null;
  productTitle: string;
  buyerName: string;
  contact: string;
  sellPrice?: number | null;
  quantity?: number;
  channel?: string | null;
  adminNote?: string | null;
};

export type CreateExpenseDto = {
  type: string;
  category: string;
  amount: number;
  currency?: string;
  description?: string | null;
  inventoryItemId?: ID | null;
  purchaseOrderId?: ID | null;
  saleId?: ID | null;
  orderId?: ID | null;
  assignedUserId?: ID | null;
  incurredAt?: ApiDate;
};

export type CreateReturnDto = {
  saleId: ID;
  orderId?: ID | null;
  reason?: string | null;
  refundAmount?: number | null;
  restock?: boolean;
  quantity?: number;
  adminNote?: string | null;
};

export type EvaluateBuyDto = {
  itemId: ID;
  listingId?: ID | null;
  buyPrice?: number | null;
  shippingPrice?: number | null;
  targetSellPrice?: number | null;
};

export type EvaluateInventoryDto = {
  inventoryItemId: ID;
  targetRoiPercent?: number;
};

export type ExecuteDecisionDto = {
  decisionSnapshotId: ID;
  note?: string | null;
};

export type ApiErrorPayload = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};