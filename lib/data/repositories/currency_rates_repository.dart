// lib/data/repositories/currency_rates_repository.dart

import 'package:lego_trading_manager/data/models/currency_rate_model.dart';
import 'package:lego_trading_manager/data/models/currency_rates_snapshot_model.dart';

abstract class AbstractCurrencyRatesDatasource {
  Future<List<CurrencyRateModel>> fetchLatestRates();
  Future<List<CurrencyRateModel>> fetchRatesByDate(DateTime date);
}

abstract class AbstractCurrencyCacheDatasource {
  Future<CurrencyRatesSnapshotModel?> load();
  Future<void> save(CurrencyRatesSnapshotModel snapshot);
  Future<void> clear();
}

class CurrencyRatesRepository {
  final AbstractCurrencyRatesDatasource remoteDatasource;
  final AbstractCurrencyCacheDatasource cacheDatasource;

  CurrencyRatesRepository({
    required this.remoteDatasource,
    required this.cacheDatasource,
  });

  Future<List<CurrencyRateModel>> fetchLatestAndCache() async {
    final rates = await remoteDatasource.fetchLatestRates();
    await cacheDatasource.save(
      CurrencyRatesSnapshotModel(
        fetchedAt: DateTime.now(),
        rates: rates,
      ),
    );
    return rates;
  }

  Future<List<CurrencyRateModel>> fetchByDate(DateTime date) {
    return remoteDatasource.fetchRatesByDate(date);
  }

  Future<CurrencyRatesSnapshotModel?> loadCache() {
    return cacheDatasource.load();
  }

  Future<void> clearCache() {
    return cacheDatasource.clear();
  }
}
