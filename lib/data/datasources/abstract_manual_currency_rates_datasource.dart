// lib/data/datasources/abstract_manual_currency_rates_datasource.dart

import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';

abstract class AbstractManualCurrencyRatesDatasource {
  Future<List<ManualCurrencyRateModel>> getAll();
  Future<void> saveAll(List<ManualCurrencyRateModel> items);
}
