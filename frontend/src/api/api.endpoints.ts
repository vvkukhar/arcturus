export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },

  health: {
    root: '/health',
  },

  dashboard: {
    root: '/dashboard',
  },

  items: {
    root: '/items',
    byId: (id: string) => `/items/${id}`,
  },

  inventory: {
    root: '/inventory',
    byId: (id: string) => `/inventory/${id}`,
  },

  watchlist: {
    root: '/watchlist',
    byId: (id: string) => `/watchlist/${id}`,
  },

  warehouse: {
    root: '/warehouse',
    locations: '/warehouse/locations',
  },

  orders: {
    root: '/orders',
    completeAsSale: '/orders/complete-as-sale',
  },

  sales: {
    root: '/sales',
    stats: '/sales/stats',
  },

  returns: {
    root: '/returns',
    stats: '/returns/stats',
    board: '/returns/board',
    approve: '/returns/approve',
    reject: '/returns/reject',
    resolve: '/returns/resolve',
  },

  expenses: {
    root: '/expenses',
    stats: '/expenses/stats',
  },

  procurement: {
    root: '/procurement',
    board: '/procurement/board',
    stats: '/procurement/stats',
    fromWatchlist: '/procurement/from-watchlist',
    status: '/procurement/status',
    receive: '/procurement/receive',
  },

  reports: {
    pnl: '/reports/pnl',
    dailyPnl: '/reports/daily-pnl',
    salesByTheme: '/reports/sales-by-theme',
    expensesByCategory: '/reports/expenses-by-category',
    snapshot: '/reports/snapshot',
    snapshots: '/reports/snapshots',
  },

  finance: {
    best: '/finance/best',
    worst: '/finance/worst',
    inventoryRisk: '/finance/inventory-risk',
    item: (id: string) => `/finance/item/${id}`,
  },

  decisionEngine: {
    buy: '/decision-engine/buy',
    inventory: '/decision-engine/inventory',
    latest: '/decision-engine/latest',
    execute: '/decision-engine/execute',
    ignore: '/decision-engine/ignore',
    review: '/decision-engine/review',
    executeTop: '/decision-engine/execute-top',
    sweepInventory: '/decision-engine/sweep/inventory',
    sweepBuy: '/decision-engine/sweep/buy',
  },

  importExport: {
    exportInventory: '/import-export/export/inventory.csv',
    exportSales: '/import-export/export/sales.csv',
    exportExpenses: '/import-export/export/expenses.csv',
    exportWatchlist: '/import-export/export/watchlist.csv',
    importItems: '/import-export/import/items',
    importExpenses: '/import-export/import/expenses',
  },

  backup: {
    root: '/backup',
    byId: (id: string) => `/backup/${id}`,
    restore: '/backup/restore',
  },

  audit: {
    root: '/audit',
    entity: (entityType: string, entityId: string) =>
      `/audit/entity/${entityType}/${entityId}`,
  },

  metrics: {
    json: '/metrics/json',
    prometheus: '/metrics',
    db: '/metrics/db',
    queues: '/metrics/queues',
  },

  planning: {
    daily: '/planning/daily',
    pressure: '/planning/pressure',
  },
} as const;