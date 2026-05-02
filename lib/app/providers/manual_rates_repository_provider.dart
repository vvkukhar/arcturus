// lib/app/providers/manual_rates_repository_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/datasources/manual/shared_prefs_manual_currency_rates_datasource.dart';
import 'package:lego_trading_manager/data/repositories/manual_currency_rates_repository.dart';

final manualCurrencyRatesRepositoryProvider = Provider((ref) {
  return ManualCurrencyRatesRepository(
    SharedPrefsManualCurrencyRatesDatasource(),
  );
});
