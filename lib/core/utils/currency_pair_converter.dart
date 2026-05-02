// lib/core/utils/currency_pair_converter.dart

class CurrencyPairConverter {
  static double convert({
    required double amount,
    required double fromRateToUah,
    required double toRateToUah,
  }) {
    if (toRateToUah == 0) return 0;
    final amountInUah = amount * fromRateToUah;
    return amountInUah / toRateToUah;
  }
}
