import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/http_client_provider.dart';
import 'package:lego_trading_manager/data/datasources/cache/shared_prefs_currency_cache_datasource.dart';
import 'package:lego_trading_manager/data/datasources/http/nbu_currency_rates_datasource.dart';
import 'package:lego_trading_manager/data/repositories/currency_rates_repository.dart';

final currencyRatesRemoteDatasourceProvider = Provider((ref) {
  return NbuCurrencyRatesDatasource(
    ref.read(httpClientProvider),
  );
});

final currencyRatesCacheDatasourceProvider = Provider((ref) {
  return SharedPrefsCurrencyCacheDatasource();
});

final currencyRatesRepositoryProvider =
    Provider<CurrencyRatesRepository>((ref) {
  return CurrencyRatesRepository(
    remoteDatasource: ref.read(currencyRatesRemoteDatasourceProvider),
    cacheDatasource: ref.read(currencyRatesCacheDatasourceProvider),
  );
});
