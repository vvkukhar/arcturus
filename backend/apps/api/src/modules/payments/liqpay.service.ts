import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class LiqPayService {
  constructor(private config: ConfigService) {}

  private getKeys() {
    return {
      public: this.config.get('LIQPAY_PUBLIC_KEY'),
      private: this.config.get('LIQPAY_PRIVATE_KEY'),
    };
  }

  generatePaymentParams(amount: number, orderId: string, description: string) {
    const { public: publicKey, private: privateKey } = this.getKeys();
    
    const params = {
      public_key: publicKey,
      version: 3,
      action: 'pay',
      amount,
      currency: 'UAH',
      description,
      order_id: orderId,
      result_url: `${this.config.get('PUBLIC_STORE_BASE_URL')}/success`,
      server_url: `${this.config.get('API_BASE')}/payments/liqpay-callback`,
    };

    const data = Buffer.from(JSON.stringify(params)).toString('base64');
    const signature = this.createSignature(data, privateKey);

    return { data, signature };
  }

  createSignature(data: string, privateKey: string): string {
    const sha1 = crypto.createHash('sha1');
    sha1.update(privateKey + data + privateKey);
    return sha1.digest('base64');
  }

  async verifyCallback(data: string, signature: string): Promise<boolean> {
    const { private: privateKey } = this.getKeys();
    const expectedSignature = this.createSignature(data, privateKey);
    return expectedSignature === signature;
  }
}