// lib/features/settings/application/currency_integrity_service.dart

import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';

class CurrencyIntegrityService {
  bool hasDuplicateCodes(List<ManualCurrencyRateModel> items) {
    final seen = <String>{};

    for (final item in items) {
      if (seen.contains(item.code)) return true;
      seen.add(item.code);
    }

    return false;
  }
}
