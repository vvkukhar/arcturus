const API_KEY = 'f8b516d2b18b6626758d145322771a33'; 

const CITY_NAME = 'Хмельницький';
const WAREHOUSE_NUMBER = '28'; 

async function npRequest(model, method, props = {}) {
  const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: API_KEY,
      modelName: model,
      calledMethod: method,
      methodProperties: props,
    })
  });
  const data = await res.json();
  if (!data.success) throw new Error(`Помилка НП: ${data.errors.join(', ')}`);
  return data.data;
}

async function main() {
  try {
    console.log('🔍 Шукаємо дані відправника...');
    
    const counterparties = await npRequest('Counterparty', 'getCounterparties', {
      CounterpartyProperty: 'Sender'
    });
    
    if (counterparties.length === 0) {
      throw new Error('Відправника не знайдено. Ви взагалі створювали контрагента в кабінеті НП?');
    }
    
    const sender = counterparties[0];
    const senderRef = sender.Ref;
    
    const contacts = await npRequest('Counterparty', 'getCounterpartyContactPersons', {
      Ref: senderRef
    });
    
    const contact = contacts[0];
    const contactRef = contact.Ref;
    const phone = contact.Phones;

    console.log(`✅ Знайдено відправника: ${sender.Description} (${phone})`);

    console.log(`\n🔍 Шукаємо місто: ${CITY_NAME}...`);
    const cities = await npRequest('Address', 'getCities', {
      FindByString: CITY_NAME
    });
    
    if (cities.length === 0) throw new Error('Місто не знайдено!');
    const cityRef = cities[0].Ref;
    console.log(`✅ Місто знайдено!`);

    console.log(`\n🔍 Шукаємо Відділення №${WAREHOUSE_NUMBER}...`);
    const warehouses = await npRequest('Address', 'getWarehouses', {
      CityRef: cityRef,
      FindByString: WAREHOUSE_NUMBER
    });
    
    const warehouse = warehouses.find(w => w.Description.includes(`№${WAREHOUSE_NUMBER}`) || w.Description.includes(`№ ${WAREHOUSE_NUMBER}`));
    if (!warehouse) throw new Error('Відділення не знайдено!');
    const warehouseRef = warehouse.Ref;
    console.log(`✅ Відділення знайдено: ${warehouse.Description}`);

    console.log('\n=============================================');
    console.log('🎉 ГОТОВО! СКОПІЮЙ ЦІ РЯДКИ В .ENV НА RENDER:');
    console.log('=============================================\n');
    
    console.log(`NOVA_POSHTA_API_KEY=${API_KEY}`);
    console.log(`NP_SENDER_REF=${senderRef}`);
    console.log(`NP_CONTACT_SENDER_REF=${contactRef}`);
    console.log(`NP_SENDER_PHONE=${phone}`);
    console.log(`NP_CITY_SENDER_REF=${cityRef}`);
    console.log(`NP_SENDER_ADDRESS_REF=${warehouseRef}`);
    
    console.log('\n=============================================');

  } catch (err) {
    console.error('❌ ПОМИЛКА:', err.message);
  }
}

main();