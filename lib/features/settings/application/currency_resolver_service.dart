// lib/features/settings/application/currency_resolver_service.dart

import 'package:lego_trading_manager/data/models/currency_rate_model.dart';
import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';

class CurrencyResolverService {
  double? resolveRateToUah({
    required String code,
    required List<CurrencyRateModel> officialRates,
    required List<ManualCurrencyRateModel> manualRates,
  }) {
    if (code == 'UAH') return 1;

    try {
      return officialRates.firstWhere((e) => e.code == code).rate;
    } catch (_) {}

    try {
      return manualRates.firstWhere((e) => e.code == code).rateToUah;
    } catch (_) {}

    return null;
  }
}
