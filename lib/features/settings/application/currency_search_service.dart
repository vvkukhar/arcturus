// lib/features/settings/application/currency_search_service.dart

import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class CurrencySearchService {
  List<CurrencyRateModel> filter(
    List<CurrencyRateModel> items,
    String query,
  ) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return items;

    return items.where((item) {
      final code = item.code.toLowerCase();
      final name = (item.name ?? '').toLowerCase();

      return code.contains(q) || name.contains(q);
    }).toList();
  }
}
