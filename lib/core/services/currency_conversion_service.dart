import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class CurrencyConversionService {
  final dynamic repository;

  CurrencyConversionService({this.repository});

  double convert({
    required double amount,
    required String fromCurrency,
    required String toCurrency,
    List<CurrencyRateModel>? rates,
  }) {
    final from = fromCurrency.trim().toUpperCase();
    final to = toCurrency.trim().toUpperCase();

    if (from == to) return amount;

    final allRates = rates ?? _safeReadRates();

    final fromRate = _resolveRateToUah(from, allRates);
    final toRate = _resolveRateToUah(to, allRates);

    final amountInUah = amount * fromRate;
    return amountInUah / toRate;
  }

  List<CurrencyRateModel> _safeReadRates() {
    try {
      final result = repository?.getRates();
      if (result is List<CurrencyRateModel>) return result;
    } catch (_) {}
    return const [];
  }

  double _resolveRateToUah(String code, List<CurrencyRateModel> rates) {
    if (code == 'UAH') return 1.0;

    final item = rates.firstWhere(
      (e) => e.code.trim().toUpperCase() == code,
      orElse: () => throw Exception('Rate not found for $code'),
    );

    return item.rateToUah;
  }
}
