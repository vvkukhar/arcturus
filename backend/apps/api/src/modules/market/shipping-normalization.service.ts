import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingNormalizationService {
  normalize(params: {
    sourceCode?: string | null;
    shippingPrice?: number | null;
    shippingCurrency?: string | null;
    itemPrice?: number | null;
    sealed?: boolean | null;
  }): number {
    if (params.shippingPrice != null && params.shippingPrice > 0) {
      return Number(params.shippingPrice.toFixed(2));
    }
    const source = (params.sourceCode ?? 'unknown').toLowerCase();
    const itemPrice = params.itemPrice ?? 0;
    if (source === 'olx') {
      if (itemPrice <= 500) return 70;
      if (itemPrice <= 1500) return 80;
      return 95;
    }
    if (source === 'bricklink') {
      if (itemPrice <= 1000) return 260;
      if (itemPrice <= 3000) return 340;
      return 420;
    }
    if (source === 'brickowl') {
      if (itemPrice <= 1000) return 280;
      if (itemPrice <= 3000) return 360;
      return 440;
    }
    if (source === 'ebay') {
      if (itemPrice <= 1000) return 350;
      if (itemPrice <= 3000) return 480;
      return 620;
    }
    if (params.sealed == true) {
      return 120;
    }
    return 90;
  }
}