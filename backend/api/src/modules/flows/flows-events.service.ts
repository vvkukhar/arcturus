import { Injectable } from '@nestjs/common';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class FlowsEventsService {
  constructor(private readonly realtime: RealtimeGateway) {}

  purchaseChanged(payload?: unknown): void {
    this.realtime.emitFlowRefresh('purchase');
    this.realtime.emitDashboardRefresh('purchase_flow_changed');
    this.realtime.emitOpportunityRefresh('purchase_flow_changed');

    if (payload != null) {
      this.realtime.emitCustom('purchase.flow.changed', payload);
    }
  }

  repriceChanged(payload?: unknown): void {
    this.realtime.emitFlowRefresh('reprice');
    this.realtime.emitDashboardRefresh('reprice_flow_changed');
    this.realtime.emitOpportunityRefresh('reprice_flow_changed');

    if (payload != null) {
      this.realtime.emitCustom('reprice.flow.changed', payload);
    }
  }

  reviewChanged(payload?: unknown): void {
    this.realtime.emitFlowRefresh('review');
    this.realtime.emitDashboardRefresh('review_flow_changed');

    if (payload != null) {
      this.realtime.emitCustom('review.flow.changed', payload);
    }
  }

  itemChanged(itemId: string): void {
    this.realtime.emitItemRefresh(itemId, 'flow_changed_item');
  }

  opportunitiesChanged(): void {
    this.realtime.emitOpportunityRefresh('flow_changed');
  }

  inventoryChanged(payload?: unknown): void {
    this.realtime.emitInventoryRefresh(payload);
  }

  watchlistChanged(payload?: unknown): void {
    this.realtime.emitWatchlistRefresh(payload);
  }
}