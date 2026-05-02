// lib/features/settings/application/currency_lookup_service.dart

import 'package:lego_trading_manager/core/utils/safe_uppercase.dart';
import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class CurrencyLookupService {
  CurrencyRateModel? find(
    List<CurrencyRateModel> rates,
    String code,
  ) {
    final normalized = SafeUppercase.call(code);

    try {
      return rates.firstWhere((e) => e.code == normalized);
    } catch (_) {
      return null;
    }
  }
}
