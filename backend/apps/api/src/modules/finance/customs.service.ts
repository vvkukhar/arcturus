import { Injectable } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Injectable()
export class CustomsService {
  private readonly TAX_FREE_LIMIT_EUR = 150;
  private readonly DUTY_RATE = 0.10;
  private readonly VAT_RATE = 0.20;

  constructor(private readonly currencyService: CurrencyService) {}

  async calculateLandedCost(params: {
    priceOriginal: number;
    currency: string;
    shippingOriginal: number;
  }): Promise<{
    baseUah: number;
    shippingUah: number;
    dutyUah: number;
    vatUah: number;
    totalLandedUah: number;
  }> {
    const baseUah = await this.currencyService.convertToUah(params.priceOriginal, params.currency);
    const shippingUah = await this.currencyService.convertToUah(params.shippingOriginal, params.currency);
    const baseEur = await this.currencyService.convertUahToEur(baseUah);

    let dutyUah = 0;
    let vatUah = 0;

    if (baseEur > this.TAX_FREE_LIMIT_EUR) {
      const taxableBaseEur = baseEur - this.TAX_FREE_LIMIT_EUR;
      const taxableBaseUah = await this.currencyService.convertToUah(taxableBaseEur, 'EUR');

      dutyUah = taxableBaseUah * this.DUTY_RATE;
      vatUah = (taxableBaseUah + dutyUah) * this.VAT_RATE;
    }

    const totalLandedUah = Number((baseUah + shippingUah + dutyUah + vatUah).toFixed(2));

    return {
      baseUah: Number(baseUah.toFixed(2)),
      shippingUah: Number(shippingUah.toFixed(2)),
      dutyUah: Number(dutyUah.toFixed(2)),
      vatUah: Number(vatUah.toFixed(2)),
      totalLandedUah
    };
  }
}