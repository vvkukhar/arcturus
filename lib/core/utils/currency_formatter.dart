// lib/core/utils/currency_formatter.dart

class CurrencyFormatter {
  static String format(
    double value, {
    required String currency,
    int decimals = 2,
  }) {
    return '${value.toStringAsFixed(decimals)} $currency';
  }
}
