import { prisma } from '../prisma';
import PDFDocument from 'pdfkit';
import FormData from 'form-data';

export async function vaultReportsJob(): Promise<{ reportsGenerated: number }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return { reportsGenerated: 0 };

  const investors = await prisma.user.findMany({
    where: { OR: [{ vaultBalance: { gt: 0 } }, { fundedItems: { some: {} } }] },
    include: { fundedItems: { include: { item: true } } }
  });

  let reportsGenerated = 0;
  const monthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  for (const investor of investors) {
    if (!investor.phone || !investor.phone.startsWith('@')) continue; 

    const tgUsername = investor.phone.replace('@', '');
    const chatIdRes = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const chatIdData = await chatIdRes.json();
    
    let chatId = null;
    if (chatIdData.ok) {
      const update = chatIdData.result.find((u: any) => u.message?.from?.username === tgUsername);
      if (update) chatId = update.message.chat.id;
    }

    if (!chatId) continue;

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    
    const endPdf = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });

    doc.fontSize(24).font('Helvetica-Bold').text('Arcturus Vault', { align: 'center' });
    doc.fontSize(14).font('Helvetica').text(`Investor Report - ${monthName}`, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(18).font('Helvetica-Bold').text('Portfolio Summary');
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`Liquid Balance: ${investor.vaultBalance.toFixed(2)} UAH`);
    doc.text(`Active Positions: ${investor.fundedItems.length}`);
    
    let totalInvested = 0;
    let expectedYield = 0;

    doc.moveDown(1);
    if (investor.fundedItems.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Active Assets');
      doc.moveDown(0.5);
      
      for (const item of investor.fundedItems) {
        totalInvested += item.totalCost;
        const projectedSell = item.expectedSalePriceManual ?? (item.totalCost * 1.35);
        const projectedProfit = (projectedSell - item.totalCost) * (item.investorProfitShare ?? 0.8);
        expectedYield += projectedProfit;

        doc.fontSize(10).font('Helvetica-Bold').text(`${item.titleSnapshot}`);
        doc.font('Helvetica').text(`Cost Basis: ${item.totalCost.toFixed(2)} UAH | Est. Yield: +${projectedProfit.toFixed(2)} UAH`);
        doc.moveDown(0.5);
      }
    }

    doc.moveDown(1);
    doc.fontSize(14).font('Helvetica-Bold').text('Projections');
    doc.fontSize(12).font('Helvetica').text(`Total Capital at Work: ${totalInvested.toFixed(2)} UAH`);
    doc.text(`Estimated Future Dividend: +${expectedYield.toFixed(2)} UAH`);
    doc.text(`Estimated Total NAV: ${(investor.vaultBalance + totalInvested + expectedYield).toFixed(2)} UAH`);

    doc.end();
    const pdfBuffer = await endPdf;

    const form = new FormData();
    form.append('chat_id', chatId.toString());
    form.append('document', pdfBuffer, { filename: `Arcturus_Vault_${monthName.replace(' ', '_')}.pdf` });
    form.append('caption', `📊 Ваша інвестиційна аналітика за ${monthName} готова.\n\nЗагальний капітал у роботі: ${totalInvested.toFixed(2)} ₴\nОчікувані дивіденди: +${expectedYield.toFixed(2)} ₴`);

    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      body: form as any,
      headers: form.getHeaders()
    });

    reportsGenerated++;
  }

  return { reportsGenerated };
}