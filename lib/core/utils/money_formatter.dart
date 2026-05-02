class MoneyFormatter {
  static String format(
    num value, {
    String currency = 'UAH',
    int decimals = 2,
  }) {
    return '${value.toStringAsFixed(decimals)} $currency';
  }
}
