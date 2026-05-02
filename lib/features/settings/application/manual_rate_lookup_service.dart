// lib/features/settings/application/manual_rate_lookup_service.dart

import 'package:lego_trading_manager/core/utils/safe_uppercase.dart';
import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';

class ManualRateLookupService {
  ManualCurrencyRateModel? find(
    List<ManualCurrencyRateModel> items,
    String code,
  ) {
    final normalized = SafeUppercase.call(code);

    try {
      return items.firstWhere((e) => e.code == normalized);
    } catch (_) {
      return null;
    }
  }
}
