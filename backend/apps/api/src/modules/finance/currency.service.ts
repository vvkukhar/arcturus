import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { fetchLiveExchangeRates, convertCurrency } from '@arcturus/shared';

@Injectable()
export class CurrencyService {
  constructor(private readonly redis: RedisService) {}

  async getRates(): Promise<Record<string, number>> {
    const cacheKey = 'finance:currency_rates';
    const cached = await this.redis.get<Record<string, number>>(cacheKey);
    if (cached) return cached;

    const rates = await fetchLiveExchangeRates();
    await this.redis.set(cacheKey, rates, 43200);
    return rates;
  }

  async convertToUah(amount: number, currency: string): Promise<number> {
    if (currency === 'UAH') return amount;
    const rates = await this.getRates();
    return convertCurrency(amount, currency, 'UAH', rates);
  }

  async convertUahToEur(amountUah: number): Promise<number> {
    const rates = await this.getRates();
    return convertCurrency(amountUah, 'UAH', 'EUR', rates);
  }
}