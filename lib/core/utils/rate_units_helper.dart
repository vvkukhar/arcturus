// lib/core/utils/rate_units_helper.dart

class RateUnitsHelper {
  static double normalizeToSingleUnit({
    required double amount,
    required int units,
  }) {
    if (units <= 0) return amount;
    return amount / units;
  }
}
