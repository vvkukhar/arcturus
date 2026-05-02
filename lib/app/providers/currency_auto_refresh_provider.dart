import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/currency_repositories_provider.dart';
import 'package:lego_trading_manager/features/settings/application/currency_auto_refresh_policy.dart';
import 'package:lego_trading_manager/features/settings/application/currency_auto_refresh_service.dart';

final currencyAutoRefreshServiceProvider =
    Provider<CurrencyAutoRefreshService>((ref) {
  return CurrencyAutoRefreshService(
    repository: ref.read(currencyRatesRepositoryProvider),
    policy: CurrencyAutoRefreshPolicy.defaultPolicy(),
  );
});
