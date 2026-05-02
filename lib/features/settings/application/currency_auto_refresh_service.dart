// lib/features/settings/application/currency_auto_refresh_service.dart

import 'package:lego_trading_manager/data/repositories/currency_rates_repository.dart';
import 'package:lego_trading_manager/features/settings/application/currency_auto_refresh_policy.dart';

class CurrencyAutoRefreshService {
  final CurrencyRatesRepository repository;
  final CurrencyAutoRefreshPolicy policy;

  CurrencyAutoRefreshService({
    required this.repository,
    required this.policy,
  });

  Future<bool> shouldRefresh() async {
    final cache = await repository.loadCache();
    if (cache == null) return true;

    final age = DateTime.now().difference(cache.fetchedAt);
    return age > policy.maxAge;
  }
}
