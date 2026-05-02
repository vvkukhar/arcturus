// lib/data/datasources/abstract_currency_cache_datasource.dart

import 'package:lego_trading_manager/data/models/currency_rates_snapshot_model.dart';

abstract class AbstractCurrencyCacheDatasource {
  Future<CurrencyRatesSnapshotModel?> load();
  Future<void> save(CurrencyRatesSnapshotModel snapshot);
  Future<void> clear();
}
