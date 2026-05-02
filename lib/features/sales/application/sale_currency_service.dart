// lib/features/sales/application/sale_currency_service.dart

class SaleCurrencyService {
  double toBaseCurrency({
    required double value,
    required double exchangeRate,
  }) {
    return value * exchangeRate;
  }
}
