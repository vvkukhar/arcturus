// lib/features/settings/application/currency_refresh_state.dart

import 'package:lego_trading_manager/features/settings/application/currency_refresh_status.dart';

class CurrencyRefreshState {
  final CurrencyRefreshStatus status;
  final String? message;

  const CurrencyRefreshState({
    required this.status,
    required this.message,
  });

  factory CurrencyRefreshState.initial() {
    return const CurrencyRefreshState(
      status: CurrencyRefreshStatus.idle,
      message: null,
    );
  }

  CurrencyRefreshState copyWith({
    CurrencyRefreshStatus? status,
    String? message,
  }) {
    return CurrencyRefreshState(
      status: status ?? this.status,
      message: message,
    );
  }
}
