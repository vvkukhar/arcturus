import {
  ApiErrorPayload,
  AuditLogDto,
  BackupSnapshotDto,
  CreateExpenseDto,
  CreateInventoryItemDto,
  CreateItemDto,
  CreateOrderDto,
  CreateReturnDto,
  CreateWatchlistItemDto,
  DashboardDto,
  DecisionSnapshotDto,
  EvaluateBuyDto,
  EvaluateInventoryDto,
  ExecuteDecisionDto,
  ExpenseDto,
  InventoryItemDto,
  ItemDto,
  LoginResponseDto,
  OrderDto,
  PnlDto,
  PurchaseOrderDto,
  ReportSnapshotDto,
  ReturnRequestDto,
  SaleDto,
  StorageLocationDto,
  UserDto,
  WarehouseDto,
  WatchlistItemDto,
} from './api.types';
import { API_ENDPOINTS } from './api.endpoints';

export class ApiError extends Error {
  status: number;
  payload: ApiErrorPayload | unknown;

  constructor(status: number, payload: ApiErrorPayload | unknown) {
    super(typeof payload === 'object' && payload && 'message' in payload
      ? String((payload as ApiErrorPayload).message)
      : `API error ${status}`);

    this.status = status;
    this.payload = payload;
  }
}

export type ApiClientOptions = {
  baseUrl: string;
  getToken?: () => string | null | undefined;
  onUnauthorized?: () => void;
};

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getToken?: () => string | null | undefined;
  private readonly onUnauthorized?: () => void;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.getToken = options.getToken;
    this.onUnauthorized = options.onUnauthorized;
  }

  private buildUrl(path: string, query?: Record<string, unknown>): string {
    const url = new URL(`${this.baseUrl}${path}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === '') {
          continue;
        }

        url.searchParams.set(key, String(value));
      }
    }

    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
      rawText?: boolean;
    },
  ): Promise<T> {
    const token = this.getToken?.();

    const response = await fetch(this.buildUrl(path, options?.query), {
      method,
      headers: {
        ...(options?.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers ?? {}),
      },
      body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    if (response.status === 401) {
      this.onUnauthorized?.();
    }

    const text = await response.text();

    if (!response.ok) {
      let payload: unknown = text;

      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = text;
      }

      throw new ApiError(response.status, payload);
    }

    if (options?.rawText) {
      return text as T;
    }

    return text ? (JSON.parse(text) as T) : (null as T);
  }

  get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
    return this.request<T>('GET', path, { query });
  }

  post<T>(path: string, body?: unknown, query?: Record<string, unknown>): Promise<T> {
    return this.request<T>('POST', path, { body, query });
  }

  patch<T>(path: string, body?: unknown, query?: Record<string, unknown>): Promise<T> {
    return this.request<T>('PATCH', path, { body, query });
  }

  delete<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('DELETE', path, { body });
  }

  downloadText(path: string, query?: Record<string, unknown>): Promise<string> {
    return this.request<string>('GET', path, {
      query,
      rawText: true,
    });
  }

  login(token: string): Promise<LoginResponseDto> {
    return this.post<LoginResponseDto>(API_ENDPOINTS.auth.login, { token });
  }

  me(): Promise<UserDto> {
    return this.get<UserDto>(API_ENDPOINTS.auth.me);
  }

  dashboard(): Promise<DashboardDto> {
    return this.get<DashboardDto>(API_ENDPOINTS.dashboard.root);
  }

  items(query?: { q?: string; limit?: number }): Promise<ItemDto[]> {
    return this.get<ItemDto[]>(API_ENDPOINTS.items.root, query);
  }

  createItem(body: CreateItemDto): Promise<ItemDto> {
    return this.post<ItemDto>(API_ENDPOINTS.items.root, body);
  }

  inventory(query?: { q?: string; limit?: number }): Promise<InventoryItemDto[]> {
    return this.get<InventoryItemDto[]>(API_ENDPOINTS.inventory.root, query);
  }

  createInventoryItem(body: CreateInventoryItemDto): Promise<InventoryItemDto> {
    return this.post<InventoryItemDto>(API_ENDPOINTS.inventory.root, body);
  }

  watchlist(query?: {
    active?: boolean;
    assignedUserId?: string;
    q?: string;
    limit?: number;
  }): Promise<WatchlistItemDto[]> {
    return this.get<WatchlistItemDto[]>(API_ENDPOINTS.watchlist.root, query);
  }

  createWatchlistItem(body: CreateWatchlistItemDto): Promise<WatchlistItemDto> {
    return this.post<WatchlistItemDto>(API_ENDPOINTS.watchlist.root, body);
  }

  warehouses(): Promise<WarehouseDto[]> {
    return this.get<WarehouseDto[]>(API_ENDPOINTS.warehouse.root);
  }

  locations(warehouseId?: string): Promise<StorageLocationDto[]> {
    return this.get<StorageLocationDto[]>(API_ENDPOINTS.warehouse.locations, {
      warehouseId,
    });
  }

  orders(query?: { status?: string; q?: string; limit?: number }): Promise<OrderDto[]> {
    return this.get<OrderDto[]>(API_ENDPOINTS.orders.root, query);
  }

  createOrder(body: CreateOrderDto): Promise<OrderDto> {
    return this.post<OrderDto>(API_ENDPOINTS.orders.root, body);
  }

  completeOrderAsSale(id: string): Promise<OrderDto> {
    return this.patch<OrderDto>(API_ENDPOINTS.orders.completeAsSale, { id });
  }

  sales(query?: { q?: string; limit?: number }): Promise<SaleDto[]> {
    return this.get<SaleDto[]>(API_ENDPOINTS.sales.root, query);
  }

  salesStats(): Promise<Record<string, unknown>> {
    return this.get<Record<string, unknown>>(API_ENDPOINTS.sales.stats);
  }

  returns(query?: {
    status?: string;
    q?: string;
    limit?: number;
  }): Promise<ReturnRequestDto[]> {
    return this.get<ReturnRequestDto[]>(API_ENDPOINTS.returns.root, query);
  }

  createReturn(body: CreateReturnDto): Promise<ReturnRequestDto> {
    return this.post<ReturnRequestDto>(API_ENDPOINTS.returns.root, body);
  }

  approveReturn(id: string): Promise<ReturnRequestDto> {
    return this.patch<ReturnRequestDto>(API_ENDPOINTS.returns.approve, { id });
  }

  resolveReturn(id: string): Promise<ReturnRequestDto> {
    return this.patch<ReturnRequestDto>(API_ENDPOINTS.returns.resolve, { id });
  }

  expenses(query?: {
    type?: string;
    category?: string;
    q?: string;
    limit?: number;
  }): Promise<ExpenseDto[]> {
    return this.get<ExpenseDto[]>(API_ENDPOINTS.expenses.root, query);
  }

  createExpense(body: CreateExpenseDto): Promise<ExpenseDto> {
    return this.post<ExpenseDto>(API_ENDPOINTS.expenses.root, body);
  }

  procurement(query?: {
    status?: string;
    q?: string;
    assignedUserId?: string;
    limit?: number;
  }): Promise<PurchaseOrderDto[]> {
    return this.get<PurchaseOrderDto[]>(API_ENDPOINTS.procurement.root, query);
  }

  createProcurementFromWatchlist(watchlistItemId: string): Promise<PurchaseOrderDto> {
    return this.post<PurchaseOrderDto>(API_ENDPOINTS.procurement.fromWatchlist, {
      watchlistItemId,
    });
  }

  receivePurchaseOrder(body: {
    id: string;
    storageLocationId?: string | null;
    warehouseId?: string | null;
  }): Promise<PurchaseOrderDto> {
    return this.patch<PurchaseOrderDto>(API_ENDPOINTS.procurement.receive, body);
  }

  pnl(query?: { from?: string; to?: string }): Promise<PnlDto> {
    return this.get<PnlDto>(API_ENDPOINTS.reports.pnl, query);
  }

  dailyPnl(query?: { from?: string; to?: string }): Promise<Record<string, unknown>[]> {
    return this.get<Record<string, unknown>[]>(API_ENDPOINTS.reports.dailyPnl, query);
  }

  saveReportSnapshot(query?: { from?: string; to?: string }): Promise<ReportSnapshotDto> {
    return this.post<ReportSnapshotDto>(API_ENDPOINTS.reports.snapshot, undefined, query);
  }

  financeItem(itemId: string): Promise<Record<string, unknown>> {
    return this.get<Record<string, unknown>>(API_ENDPOINTS.finance.item(itemId));
  }

  financeBest(): Promise<Record<string, unknown>[]> {
    return this.get<Record<string, unknown>[]>(API_ENDPOINTS.finance.best);
  }

  financeWorst(): Promise<Record<string, unknown>[]> {
    return this.get<Record<string, unknown>[]>(API_ENDPOINTS.finance.worst);
  }

  inventoryRisk(): Promise<Record<string, unknown>[]> {
    return this.get<Record<string, unknown>[]>(API_ENDPOINTS.finance.inventoryRisk);
  }

  evaluateBuy(body: EvaluateBuyDto): Promise<DecisionSnapshotDto> {
    return this.post<DecisionSnapshotDto>(API_ENDPOINTS.decisionEngine.buy, body);
  }

  evaluateInventory(body: EvaluateInventoryDto): Promise<DecisionSnapshotDto> {
    return this.post<DecisionSnapshotDto>(API_ENDPOINTS.decisionEngine.inventory, body);
  }

  latestDecisions(query?: {
    contextType?: string;
    action?: string;
    executionStatus?: string;
    limit?: number;
  }): Promise<DecisionSnapshotDto[]> {
    return this.get<DecisionSnapshotDto[]>(API_ENDPOINTS.decisionEngine.latest, query);
  }

  executeDecision(body: ExecuteDecisionDto): Promise<unknown> {
    return this.patch<unknown>(API_ENDPOINTS.decisionEngine.execute, body);
  }

  ignoreDecision(body: ExecuteDecisionDto): Promise<DecisionSnapshotDto> {
    return this.patch<DecisionSnapshotDto>(API_ENDPOINTS.decisionEngine.ignore, body);
  }

  backup(body?: { type?: string; notes?: string | null }): Promise<BackupSnapshotDto> {
    return this.post<BackupSnapshotDto>(API_ENDPOINTS.backup.root, body ?? {});
  }

  backups(): Promise<BackupSnapshotDto[]> {
    return this.get<BackupSnapshotDto[]>(API_ENDPOINTS.backup.root);
  }

  restoreBackup(body: {
    backupSnapshotId: string;
    dryRun?: boolean;
  }): Promise<unknown> {
    return this.patch<unknown>(API_ENDPOINTS.backup.restore, body);
  }

  audit(query?: {
    actorUserId?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    limit?: number;
  }): Promise<AuditLogDto[]> {
    return this.get<AuditLogDto[]>(API_ENDPOINTS.audit.root, query);
  }

  exportInventoryCsv(): Promise<string> {
    return this.downloadText(API_ENDPOINTS.importExport.exportInventory);
  }

  exportSalesCsv(): Promise<string> {
    return this.downloadText(API_ENDPOINTS.importExport.exportSales);
  }

  exportExpensesCsv(): Promise<string> {
    return this.downloadText(API_ENDPOINTS.importExport.exportExpenses);
  }

  exportWatchlistCsv(): Promise<string> {
    return this.downloadText(API_ENDPOINTS.importExport.exportWatchlist);
  }
}