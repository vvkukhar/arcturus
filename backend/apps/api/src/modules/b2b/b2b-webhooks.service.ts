import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class B2bWebhooksService {
  private readonly logger = new Logger(B2bWebhooksService.name);

  constructor(private readonly prisma: PrismaService) {}

  private signPayload(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  async dispatchInventoryUpdate(inventoryItemId: string, newQuantity: number) {
    const hooks = await this.prisma.b2bWebhook.findMany({
      where: { active: true, event: 'inventory.updated' }
    });

    if (hooks.length === 0) return;

    const payload = JSON.stringify({
      event: 'inventory.updated',
      data: { inventoryItemId, quantity: newQuantity, timestamp: new Date().toISOString() }
    });

    for (const hook of hooks) {
      try {
        const signature = this.signPayload(payload, hook.secret);
        fetch(hook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Arcturus-Signature': signature
          },
          body: payload
        }).catch(() => {});
      } catch (e) {
        this.logger.error(`Webhook dispatch failed for ${hook.url}`);
      }
    }
  }
}