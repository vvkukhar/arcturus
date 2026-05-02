class PurchaseCurrencyService {
  double toBaseCurrency({
    required double finalTotal,
    required double exchangeRate,
  }) {
    return finalTotal * exchangeRate;
  }
}