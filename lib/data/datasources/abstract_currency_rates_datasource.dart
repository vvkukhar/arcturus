// lib/data/datasources/abstract_currency_rates_datasource.dart

import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

abstract class AbstractCurrencyRatesDatasource {
  Future<List<CurrencyRateModel>> fetchLatestRates();
  Future<List<CurrencyRateModel>> fetchRatesByDate(DateTime date);
}
