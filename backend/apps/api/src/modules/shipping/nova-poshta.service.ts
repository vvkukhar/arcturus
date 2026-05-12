import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class NovaPoshtaService {
  private readonly apiKey = process.env.NOVA_POSHTA_API_KEY;
  private readonly apiUrl = 'https://api.novaposhta.ua/v2.0/json/';

  async createExpressWaybill(params: {
    orderId: string;
    firstName: string;
    lastName: string;
    phone: string;
    cityRecipient: string;
    warehouseRecipient: string;
    weight: number;
    cost: number;
  }): Promise<string> {
    if (!this.apiKey) {
      throw new BadRequestException('Nova Poshta API key is missing');
    }

    const payload = {
      apiKey: this.apiKey,
      modelName: 'InternetDocument',
      calledMethod: 'save',
      methodProperties: {
        PayerType: 'Recipient',
        PaymentMethod: 'Cash',
        DateTime: new Date().toLocaleDateString('uk-UA').replace(/\./g, '.'),
        CargoType: 'Cargo',
        VolumeGeneral: '0.01',
        Weight: params.weight.toString(),
        ServiceType: 'WarehouseWarehouse',
        SeatsAmount: '1',
        Description: `LEGO Order ${params.orderId}`,
        Cost: params.cost.toString(),
        CitySender: process.env.NP_CITY_SENDER_REF,
        Sender: process.env.NP_SENDER_REF,
        SenderAddress: process.env.NP_SENDER_ADDRESS_REF,
        ContactSender: process.env.NP_CONTACT_SENDER_REF,
        SendersPhone: process.env.NP_SENDER_PHONE,
        RecipientCityName: params.cityRecipient,
        RecipientArea: '',
        RecipientAreaRegions: '',
        AddressRecipient: params.warehouseRecipient,
        RecipientsPhone: params.phone,
        RecipientName: `${params.firstName} ${params.lastName}`
      }
    };

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new BadRequestException(`NP Error: ${data.errors.join(', ')}`);
    }

    return data.data[0].IntDocNumber;
  }
}