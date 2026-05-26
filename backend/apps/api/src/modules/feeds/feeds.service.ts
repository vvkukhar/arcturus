import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedsService {
  private readonly storeUrl = process.env.PUBLIC_STORE_BASE_URL || 'https://arcturus.store';
  private readonly companyName = 'Arcturus Premium LEGO';

  constructor(private readonly prisma: PrismaService) {}

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  async generatePromYml(): Promise<string> {
    const items = await this.prisma.inventoryItem.findMany({
      where: { 
        quantity: { gt: 0 }, 
        OR: [{ isMarketplace: false }, { isMarketplace: true, approvalStatus: 'approved' }] 
      },
      include: { item: true, images: { orderBy: { sortOrder: 'asc' } } }
    });

    const date = new Date().toISOString().slice(0, 16).replace('T', ' ');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${date}">
  <shop>
    <name>${this.companyName}</name>
    <company>${this.companyName}</company>
    <url>${this.storeUrl}</url>
    <currencies><currency id="UAH" rate="1"/></currencies>
    <categories><category id="1">Конструктори LEGO</category></categories>
    <offers>
`;

    for (const inv of items) {
      const price = inv.expectedSalePriceManual ?? inv.totalCost;
      const url = `${this.storeUrl}/store/catalog/${this.escapeXml(inv.titleSnapshot.toLowerCase().replace(/\s+/g, '-'))}`;
      const img = inv.images[0]?.imageUrl || '';
      
      xml += `      <offer id="${inv.id}" available="true">
        <url>${url}</url>
        <price>${price}</price>
        <currencyId>UAH</currencyId>
        <categoryId>1</categoryId>
        <picture>${this.escapeXml(img)}</picture>
        <name>${this.escapeXml(inv.titleSnapshot)}</name>
        <vendor>LEGO</vendor>
        <description>${this.escapeXml(inv.notes || 'Оригінальний набір LEGO. Стан: ' + inv.condition)}</description>
        <param name="Стан">${inv.condition === 'new' || inv.sealed ? 'Новий' : 'Вживаний'}</param>
        <param name="Серія">${this.escapeXml(inv.item.theme || 'LEGO')}</param>
      </offer>\n`;
    }

    xml += `    </offers>\n  </shop>\n</yml_catalog>`;
    return xml;
  }

  async generateGoogleXml(): Promise<string> {
    const items = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 }, OR: [{ isMarketplace: false }, { approvalStatus: 'approved' }] },
      include: { item: true, images: { orderBy: { sortOrder: 'asc' } } }
    });

    let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${this.companyName}</title>
    <link>${this.storeUrl}</link>
    <description>Premium LEGO Store</description>
`;

    for (const inv of items) {
      const price = inv.expectedSalePriceManual ?? inv.totalCost;
      const url = `${this.storeUrl}/store/catalog/${this.escapeXml(inv.titleSnapshot.toLowerCase().replace(/\s+/g, '-'))}`;
      const img = inv.images[0]?.imageUrl || '';
      const condition = inv.condition === 'new' || inv.sealed ? 'new' : 'used';

      xml += `    <item>
      <g:id>${inv.id}</g:id>
      <g:title>${this.escapeXml(inv.titleSnapshot)}</g:title>
      <g:description>${this.escapeXml(inv.notes || 'LEGO Set')}</g:description>
      <g:link>${url}</g:link>
      <g:image_link>${this.escapeXml(img)}</g:image_link>
      <g:condition>${condition}</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${price} UAH</g:price>
      <g:brand>LEGO</g:brand>
    </item>\n`;
    }

    xml += `  </channel>\n</rss>`;
    return xml;
  }
}