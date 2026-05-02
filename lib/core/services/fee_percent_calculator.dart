// lib/core/services/fee_percent_calculator.dart

class FeePercentCalculator {
  static double fromPercent({
    required double base,
    required double percent,
  }) {
    return base * (percent / 100);
  }
}
