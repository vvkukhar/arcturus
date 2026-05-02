import { Injectable } from '@nestjs/common';

export type ShippingRealismInput = {
  sourceCode: string;
  country?: string | null;
  price: number;
  sealed?: boolean | null;
};

@Injectable()
export class ShippingRealismService {
  estimate(input: ShippingRealismInput): number {
    const source = input.sourceCode.toLowerCase();
    const country = (input.country ?? '').toUpperCase();

    if (source === 'olx') {
      if (input.price <= 500) return 70;
      if (input.price <= 1500) return 80;
      return 95;
    }

    if (source === 'bricklink' || source === 'brickowl') {
      if (country === 'UA') return 120;
      if (country === 'PL') return 260;
      if (country === 'DE') return 320;
      if (country === 'US') return 520;
      return 380;
    }

    if (source === 'ebay') {
      if (country === 'US') return 560;
      if (country === 'GB') return 420;
      return 460;
    }

    return input.sealed == true ? 120 : 90;
  }
}