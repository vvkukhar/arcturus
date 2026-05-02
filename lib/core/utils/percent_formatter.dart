class PercentFormatter {
  static String format(
    num value, {
    int decimals = 1,
    bool withSign = false,
  }) {
    final number = value.toDouble();
    final sign = withSign && number > 0 ? '+' : '';
    return '$sign${number.toStringAsFixed(decimals)}%';
  }
}
