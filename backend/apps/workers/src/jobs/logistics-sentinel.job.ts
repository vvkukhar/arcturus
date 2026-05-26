import { prisma } from '../prisma';

export async function logisticsSentinelJob(): Promise<{ tracked: number; alerts: number }> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activeOrders = await prisma.order.findMany({
    where: {
      status: { in: ['contacted', 'sold', 'paid'] },
      adminNote: { contains: '[TTN:' },
      createdAt: { gt: thirtyDaysAgo }
    }
  });

  if (activeOrders.length === 0) return { tracked: 0, alerts: 0 };

  const ttnMap = new Map<string, typeof activeOrders[0]>();
  const ttns: string[] = [];

  for (const order of activeOrders) {
    const match = order.adminNote?.match(/\[TTN:\s*(\d+)\]/);
    if (match && match[1]) {
      ttns.push(match[1]);
      ttnMap.set(match[1], order);
    }
  }

  const npApiKey = process.env.NOVA_POSHTA_API_KEY;
  if (!npApiKey || ttns.length === 0) return { tracked: 0, alerts: 0 };

  const payload = {
    apiKey: npApiKey,
    modelName: 'TrackingDocument',
    calledMethod: 'getStatusDocuments',
    methodProperties: { Documents: ttns.map(t => ({ DocumentNumber: t, Phone: '' })) }
  };

  const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!data.success) return { tracked: ttns.length, alerts: 0 };

  let alerts = 0;

  for (const doc of data.data) {
    const stateId = String(doc.StateId);
    const order = ttnMap.get(doc.Number);
    if (!order) continue;

    if (['7', '8'].includes(stateId)) {
      const arrivedDateStr = doc.DateFirstDay;
      if (arrivedDateStr) {
        const arrivedDate = new Date(arrivedDateStr.split('.').reverse().join('-'));
        const diffDays = (Date.now() - arrivedDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays >= 3) {
          await prisma.notification.create({
            data: {
              title: '⚠️ Logistics Alert: Abandoned Package',
              message: `Order ${order.id.slice(-6)} (${order.buyerName}) has been sitting at the branch for ${Math.floor(diffDays)} days. TTN: ${doc.Number}`,
              type: 'logistics_alert',
              payloadJson: { orderId: order.id, ttn: doc.Number, diffDays }
            }
          });
          alerts++;
        }
      }
    }
  }

  return { tracked: ttns.length, alerts };
}