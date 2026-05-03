import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/conversion_history_provider.dart';
import 'package:lego_trading_manager/features/settings/application/currency_converter_state.dart';

class CurrencyConverterController extends Notifier<CurrencyConverterState> {
  @override
  CurrencyConverterState build() {
    return CurrencyConverterState.initial();
  }

  void setFromCurrency(String value) {
    state = state.copyWith(fromCurrency: value);
  }

  void setToCurrency(String value) {
    state = state.copyWith(toCurrency: value);
  }

  void setInputAmount(double value) {
    state = state.copyWith(inputAmount: value);
    _recalculate();
  }

  void setRate(double value) {
    state = state.copyWith(rate: value);
    _recalculate();
  }

  void _recalculate() {
    final output = state.inputAmount * state.rate;
    state = state.copyWith(outputAmount: output);
  }

  Future<void> saveToHistory() async {
    await ref.read(conversionHistoryServiceProvider).add(
          fromCurrency: state.fromCurrency,
          toCurrency: state.toCurrency,
          inputAmount: state.inputAmount,
          rate: state.rate,
          outputAmount: state.outputAmount,
        );
  }
}

final currencyConverterControllerProvider =
    NotifierProvider<CurrencyConverterController, CurrencyConverterState>(
  CurrencyConverterController.new,
);