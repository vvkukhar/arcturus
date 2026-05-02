import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/currency_auto_refresh_provider.dart';
import 'package:lego_trading_manager/features/settings/application/currency_rates_controller.dart';

class AppBootstrapCurrencyService {
  final Ref ref;

  AppBootstrapCurrencyService(this.ref);

  Future<void> warmup() async {
    final shouldRefresh =
        await ref.read(currencyAutoRefreshServiceProvider).shouldRefresh();

    if (shouldRefresh) {
      await ref.read(currencyRatesControllerProvider.notifier).loadLatest();
    }
  }
}
