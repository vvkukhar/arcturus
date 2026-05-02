// lib/features/settings/application/currency_stats_service.dart

import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class CurrencyStatsService {
  double averageRate(List<CurrencyRateModel> items) {
    if (items.isEmpty) return 0;
    final total = items.fold<double>(0, (sum, item) => sum + item.rate);
    return total / items.length;
  }
}
