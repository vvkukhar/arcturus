import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/currency_repositories_provider.dart';
import 'package:lego_trading_manager/features/settings/application/currency_rate_source.dart';
import 'package:lego_trading_manager/features/settings/application/currency_rate_state.dart';

class CurrencyRatesController extends Notifier<CurrencyRateState> {
  @override
  CurrencyRateState build() {
    return CurrencyRateState.initial();
  }

  Future<void> loadLatest() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final rates = await ref.read(currencyRatesRepositoryProvider).fetchLatestAndCache();
      state = state.copyWith(
        isLoading: false,
        rates: rates,
        source: CurrencyRateSource.nbuOfficial,
      );
    } catch (e) {
      final cached = await ref.read(currencyRatesRepositoryProvider).loadCache();
      state = state.copyWith(
        isLoading: false,
        rates: cached?.rates ?? const [],
        error: e.toString(),
        source: CurrencyRateSource.cached,
      );
    }
  }

  Future<void> loadByDate(DateTime date) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final rates = await ref.read(currencyRatesRepositoryProvider).fetchByDate(date);
      state = state.copyWith(
        isLoading: false,
        rates: rates,
        source: CurrencyRateSource.nbuOfficial,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> clearCache() async {
    await ref.read(currencyRatesRepositoryProvider).clearCache();
  }
}

final currencyRatesControllerProvider =
    NotifierProvider<CurrencyRatesController, CurrencyRateState>(
  CurrencyRatesController.new,
);