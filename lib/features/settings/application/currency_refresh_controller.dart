// lib/features/settings/application/currency_refresh_controller.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_rates_controller.dart';
import 'package:lego_trading_manager/features/settings/application/currency_refresh_state.dart';
import 'package:lego_trading_manager/features/settings/application/currency_refresh_status.dart';

class CurrencyRefreshController extends StateNotifier<CurrencyRefreshState> {
  final Ref ref;

  CurrencyRefreshController(this.ref) : super(CurrencyRefreshState.initial());

  Future<void> refresh() async {
    state = state.copyWith(
      status: CurrencyRefreshStatus.loading,
      message: null,
    );

    try {
      await ref.read(currencyRatesControllerProvider.notifier).loadLatest();
      state = state.copyWith(
        status: CurrencyRefreshStatus.success,
        message: 'Rates refreshed',
      );
    } catch (e) {
      state = state.copyWith(
        status: CurrencyRefreshStatus.failure,
        message: e.toString(),
      );
    }
  }
}

final currencyRefreshControllerProvider =
    StateNotifierProvider<CurrencyRefreshController, CurrencyRefreshState>(
  (ref) => CurrencyRefreshController(ref),
);
