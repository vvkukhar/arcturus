type Json = Record<string, any>;

const API_BASE = process.env.API_BASE ?? 'http://localhost:4000/api';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'supersecret';

async function api<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.token ? { Authorization: `Bearer ${init.token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      `Request failed ${response.status} ${path}: ${JSON.stringify(data)}`,
    );
  }

  return data as T;
}

async function main(): Promise<void> {
  console.log('[smoke] API_BASE', API_BASE);

  const health = await api<Json>('/health');
  console.log('[smoke] health ok', health.ok);

  const login = await api<{ token: string; user: Json }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ token: ADMIN_TOKEN }),
  });

  console.log('[smoke] login user', login.user.email);

  const item = await api<Json>('/items', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      title: `Smoke LEGO Ninjago ${Date.now()}`,
      setNumber: String(Math.floor(100000 + Math.random() * 899999)),
      theme: 'Ninjago',
      kind: 'set',
    }),
  });

  console.log('[smoke] item created', item.id);

  const warehouses = await api<Json[]>('/warehouse', {
    token: login.token,
  });

  const warehouse = warehouses[0];

  if (!warehouse) {
    throw new Error('No warehouse found. Run seed first.');
  }

  const locations = await api<Json[]>(
    `/warehouse/locations?warehouseId=${warehouse.id}`,
    {
      token: login.token,
    },
  );

  const location = locations[0];

  if (!location) {
    throw new Error('No storage location found. Run seed first.');
  }

  const inventory = await api<Json>('/inventory', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      itemId: item.id,
      titleSnapshot: item.title,
      purchasePrice: 1000,
      totalCost: 1100,
      quantity: 2,
      condition: 'used',
      sealed: false,
      expectedSalePriceManual: 1700,
      storageLocationId: location.id,
      warehouseId: warehouse.id,
    }),
  });

  console.log('[smoke] inventory created', inventory.id);

  const inventoryDecision = await api<Json>('/decision-engine/inventory', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      inventoryItemId: inventory.id,
      targetRoiPercent: 35,
    }),
  });

  console.log('[smoke] inventory decision', inventoryDecision.action);

  const buyDecision = await api<Json>('/decision-engine/buy', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      itemId: item.id,
      buyPrice: 900,
      shippingPrice: 80,
      targetSellPrice: 1700,
    }),
  });

  console.log('[smoke] buy decision', buyDecision.action);

  const latestDecisions = await api<Json[]>('/decision-engine/latest?limit=5', {
    token: login.token,
  });

  console.log('[smoke] latest decisions', latestDecisions.length);

  const financeItem = await api<Json>(`/finance/item/${item.id}`, {
    token: login.token,
  });

  console.log('[smoke] finance item netProfit', financeItem.netProfit);

  const watchlist = await api<Json>('/watchlist', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      itemId: item.id,
      titleSnapshot: item.title,
      desiredBuyPrice: 900,
      maxBuyPrice: 1100,
      targetSellPrice: 1700,
      active: true,
      priority: 80,
    }),
  });

  console.log('[smoke] watchlist created', watchlist.id);

  const purchaseOrder = await api<Json>('/procurement/from-watchlist', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      watchlistItemId: watchlist.id,
    }),
  });

  console.log('[smoke] purchase order created', purchaseOrder.id);

  const purchaseExpense = await api<Json>('/expenses', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      type: 'procurement',
      category: 'shipping',
      amount: 80,
      purchaseOrderId: purchaseOrder.id,
      description: 'Smoke purchase shipping',
    }),
  });

  console.log('[smoke] purchase expense created', purchaseExpense.id);

  const updatedPurchaseOrder = await api<Json>('/procurement', {
    method: 'PATCH',
    token: login.token,
    body: JSON.stringify({
      id: purchaseOrder.id,
      status: 'paid',
      actualPrice: 950,
      shippingPrice: 80,
    }),
  });

  console.log('[smoke] purchase order updated', updatedPurchaseOrder.status);

  const receivedPurchaseOrder = await api<Json>('/procurement/receive', {
    method: 'PATCH',
    token: login.token,
    body: JSON.stringify({
      id: purchaseOrder.id,
      storageLocationId: location.id,
      warehouseId: warehouse.id,
    }),
  });

  console.log('[smoke] purchase order received', receivedPurchaseOrder.id);

  const purchaseFlow = await api<Json>('/flows/purchase/add', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      watchlistItemId: watchlist.id,
    }),
  });

  console.log('[smoke] purchase flow created', purchaseFlow.id);

  const repriceFlow = await api<Json>('/flows/reprice/add', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      inventoryItemId: inventory.id,
    }),
  });

  console.log('[smoke] reprice flow created', repriceFlow.id);

  const repricer = await api<Json>('/repricer/analyze', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      inventoryItemId: inventory.id,
      targetRoiPercent: 40,
    }),
  });

  console.log('[smoke] repricer suggested', repricer.suggestedPrice);

  const order = await api<Json>('/orders', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      inventoryItemId: inventory.id,
      productTitle: inventory.titleSnapshot,
      buyerName: 'Smoke Buyer',
      contact: '+380000000000',
      sellPrice: 1700,
      quantity: 1,
      channel: 'smoke',
    }),
  });

  console.log('[smoke] order created', order.id);

  const completedOrder = await api<Json>('/orders/complete-as-sale', {
    method: 'PATCH',
    token: login.token,
    body: JSON.stringify({
      id: order.id,
    }),
  });

  console.log('[smoke] order completed as sale', completedOrder.id);

  if (!completedOrder.saleId) {
    throw new Error('Completed order has no saleId');
  }

  const saleExpense = await api<Json>('/expenses', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      type: 'sales',
      category: 'packaging',
      amount: 35,
      saleId: completedOrder.saleId,
      orderId: completedOrder.id,
      inventoryItemId: inventory.id,
      description: 'Smoke packaging expense',
    }),
  });

  console.log('[smoke] sale expense created', saleExpense.id);

  const returnRequest = await api<Json>('/returns', {
    method: 'POST',
    token: login.token,
    body: JSON.stringify({
      saleId: completedOrder.saleId,
      orderId: completedOrder.id,
      reason: 'Smoke return test',
      refundAmount: 1700,
      restock: true,
      quantity: 1,
      adminNote: 'Smoke test refund',
    }),
  });

  console.log('[smoke] return created', returnRequest.id);

  const approvedReturn = await api<Json>('/returns/approve', {
    method: 'PATCH',
    token: login.token,
    body: JSON.stringify({
      id: returnRequest.id,
    }),
  });

  console.log('[smoke] return approved', approvedReturn.status);

  const resolvedReturn = await api<Json>('/returns/resolve', {
    method: 'PATCH',
    token: login.token,
    body: JSON.stringify({
      id: returnRequest.id,
    }),
  });

  console.log('[smoke] return resolved', resolvedReturn.status);

  const pnl = await api<Json>('/reports/pnl', {
    token: login.token,
  });

  console.log('[smoke] pnl netProfit', pnl.profit.netProfit);

  const dailyPnl = await api<Json[]>('/reports/daily-pnl', {
    token: login.token,
  });

  console.log('[smoke] daily pnl rows', dailyPnl.length);

  const reportSnapshot = await api<Json>('/reports/snapshot', {
    method: 'POST',
    token: login.token,
  });

  console.log('[smoke] report snapshot created', reportSnapshot.id);

  const inventorySweep = await api<Json>('/decision-engine/sweep/inventory', {
    method: 'PATCH',
    token: login.token,
  });

  console.log('[smoke] inventory sweep evaluated', inventorySweep.evaluated);

  const expensesStats = await api<Json>('/expenses/stats', {
    token: login.token,
  });

  console.log('[smoke] expenses total', expensesStats.total);

  const salesStats = await api<Json>('/sales/stats', {
    token: login.token,
  });

  console.log('[smoke] sales netProfit', salesStats.netProfit);

  const returnStats = await api<Json>('/returns/stats', {
    token: login.token,
  });

  console.log('[smoke] returns total', returnStats.total);

  const dashboard = await api<Json>('/dashboard', {
    token: login.token,
  });

  console.log('[smoke] dashboard loaded', Boolean(dashboard.businessSnapshot));

  const allocation = await api<Json>('/allocation', {
    token: login.token,
  });

  console.log('[smoke] allocation capitalAtWork', allocation.capitalAtWork);

  const pressure = await api<Json>('/planning/pressure', {
    token: login.token,
  });

  console.log('[smoke] pressure tier', pressure.tier);

  const queueStats = await api<Json[]>('/queue/stats', {
    token: login.token,
  });

  console.log('[smoke] queues', queueStats.map((x) => x.name).join(', '));

  console.log('[smoke] ✅ passed');
}

main().catch((error) => {
  console.error('[smoke] ❌ failed');
  console.error(error);
  process.exit(1);
});
export {};