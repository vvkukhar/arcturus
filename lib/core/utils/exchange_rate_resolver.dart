import 'package:lego_trading_manager/data/models/currency_rate_model.dart';
import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';

class ExchangeRateResolver {
  static double resolveToUah({
    required String currency,
    required List<CurrencyRateModel> officialRates,
    required List<ManualCurrencyRateModel> manualRates,
  }) {
    final code = currency.trim().toUpperCase();

    if (code == 'UAH') return 1;

    for (final item in officialRates) {
      if (item.code == code) return item.rate;
    }

    for (final item in manualRates) {
      if (item.code == code) return item.rateToUah;
    }

    return 1;
  }
}
