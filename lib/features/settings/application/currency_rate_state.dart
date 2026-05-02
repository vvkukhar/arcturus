// lib/features/settings/application/currency_rate_state.dart

import 'package:lego_trading_manager/data/models/currency_rate_model.dart';
import 'package:lego_trading_manager/features/settings/application/currency_rate_source.dart';

class CurrencyRateState {
  final bool isLoading;
  final List<CurrencyRateModel> rates;
  final String? error;
  final CurrencyRateSource source;

  const CurrencyRateState({
    required this.isLoading,
    required this.rates,
    required this.error,
    required this.source,
  });

  factory CurrencyRateState.initial() {
    return const CurrencyRateState(
      isLoading: false,
      rates: [],
      error: null,
      source: CurrencyRateSource.cached,
    );
  }

  CurrencyRateState copyWith({
    bool? isLoading,
    List<CurrencyRateModel>? rates,
    String? error,
    CurrencyRateSource? source,
  }) {
    return CurrencyRateState(
      isLoading: isLoading ?? this.isLoading,
      rates: rates ?? this.rates,
      error: error,
      source: source ?? this.source,
    );
  }
}
