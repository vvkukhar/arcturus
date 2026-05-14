const NP_API_URL = 'https://api.novaposhta.ua/v2.0/json/';
const NP_API_KEY = process.env.NEXT_PUBLIC_NP_API_KEY || '';

export interface NPCity {
  Ref: string;
  Description: string;
  AreaDescription: string;
}

export interface NPWarehouse {
  Ref: string;
  Description: string;
  Number: string;
}

async function npRequest<T>(model: string, method: string, properties: Record<string, unknown> = {}): Promise<T[]> {
  try {
    const res = await fetch(NP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: NP_API_KEY,
        modelName: model,
        calledMethod: method,
        methodProperties: properties,
      }),
      next: { revalidate: 86400 },
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

export async function searchNPCities(query: string): Promise<NPCity[]> {
  if (!query) return [];
  return npRequest<NPCity>('Address', 'getCities', { FindByString: query, Limit: 20 });
}

export async function getNPWarehouses(cityRef: string): Promise<NPWarehouse[]> {
  if (!cityRef) return [];
  return npRequest<NPWarehouse>('Address', 'getWarehouses', { CityRef: cityRef });
}