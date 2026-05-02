// lib/features/settings/application/currency_screen_init_service.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_rates_controller.dart';

class CurrencyScreenInitService {
  final Ref ref;

  CurrencyScreenInitService(this.ref);

  Future<void> init() async {
    final state = ref.read(currencyRatesControllerProvider);
    if (state.rates.isEmpty && !state.isLoading) {
      await ref.read(currencyRatesControllerProvider.notifier).loadLatest();
    }
  }
}
