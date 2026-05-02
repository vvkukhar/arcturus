// lib/features/settings/application/currency_rate_sort_service.dart

import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class CurrencyRateSortService {
  List<CurrencyRateModel> sortByCode(List<CurrencyRateModel> items) {
    final next = [...items];
    next.sort((a, b) => a.code.compareTo(b.code));
    return next;
  }
}
