import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { FlowsService } from './flows.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @Get('purchase')
  listPurchase(@Query('status') status?: string): Promise<unknown[]> {
    return this.flowsService.listPurchaseFlow(status);
  }

  @Post('purchase/add')
  addPurchase(
    @Body()
    body: {
      watchlistItemId: string;
    },
  ): Promise<unknown> {
    return this.flowsService.addToPurchaseFlow(body.watchlistItemId);
  }

  @Patch('purchase')
  updatePurchase(
    @Body()
    body: {
      id: string;
      status?: string;
      selectedPrice?: number | null;
      reason?: string | null;
    },
  ): Promise<unknown> {
    return this.flowsService.updatePurchaseFlow(body);
  }

  @Patch('purchase/bought')
  markPurchaseBought(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.flowsService.markPurchaseBought(body.id);
  }

  @Delete('purchase')
  removePurchase(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.flowsService.removePurchaseFlow(body.id);
  }

  @Get('reprice')
  listReprice(@Query('status') status?: string): Promise<unknown[]> {
    return this.flowsService.listRepriceFlow(status);
  }

  @Post('reprice/add')
  addReprice(
    @Body()
    body: {
      inventoryItemId: string;
    },
  ): Promise<unknown> {
    return this.flowsService.addToRepriceFlow(body.inventoryItemId);
  }

  @Patch('reprice')
  updateReprice(
    @Body()
    body: {
      id: string;
      status?: string;
      currentPrice?: number | null;
      suggestedPrice?: number | null;
      reason?: string | null;
    },
  ): Promise<unknown> {
    return this.flowsService.updateRepriceFlow(body);
  }

  @Patch('reprice/listed')
  markRepriceListed(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.flowsService.markRepriceListed(body.id);
  }

  @Delete('reprice')
  removeReprice(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.flowsService.removeRepriceFlow(body.id);
  }

  @Get('review')
  listReview(@Query('status') status?: string): Promise<unknown[]> {
    return this.flowsService.listReviewFlow(status);
  }

  @Post('review/add')
  addReview(
    @Body()
    body: {
      inventoryItemId: string;
      reason?: string | null;
    },
  ): Promise<unknown> {
    return this.flowsService.addToReviewFlow(body);
  }

  @Patch('review')
  updateReview(
    @Body()
    body: {
      id: string;
      status?: string;
      reason?: string | null;
    },
  ): Promise<unknown> {
    return this.flowsService.updateReviewFlow(body);
  }

  @Patch('review/done')
  markReviewDone(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.flowsService.markReviewDone(body.id);
  }

  @Delete('review')
  removeReview(
    @Body()
    body: {
      id: string;
    },
  ): Promise<unknown> {
    return this.flowsService.removeReviewFlow(body.id);
  }

  @Delete('completed')
  clearCompleted(): Promise<unknown> {
    return this.flowsService.clearCompleted();
  }
}