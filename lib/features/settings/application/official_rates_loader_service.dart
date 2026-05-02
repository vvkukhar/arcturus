import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/official_rates_cache_provider.dart';
import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class OfficialRatesLoaderService {
  final Ref ref;

  OfficialRatesLoaderService(this.ref);

  Future<List<CurrencyRateModel>> load() async {
    final raw = await ref.read(officialRatesCacheServiceProvider).load();
    final fetchedAt =
        await ref.read(officialRatesCacheServiceProvider).loadFetchedAt();

    return raw.map((e) {
      return CurrencyRateModel(
        code: (e['cc'] as String?) ?? '',
        name: (e['txt'] as String?) ?? '',
        rate: ((e['rate'] as num?) ?? 0).toDouble(),
        baseCurrency: 'UAH',
        fetchedAt: fetchedAt ?? DateTime.now(),
        source: 'cache',
        units: 1,
        special: null,
      );
    }).toList();
  }
}