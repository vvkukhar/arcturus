class CurrencyConverter {
  static double toBase({
    required double amount,
    required String fromCurrency,
    required String baseCurrency,
    required double usdToUahRate,
    required double eurToUahRate,
  }) {
    if (fromCurrency == baseCurrency) return amount;

    if (fromCurrency == 'USD' && baseCurrency == 'UAH') {
      return amount * usdToUahRate;
    }

    if (fromCurrency == 'EUR' && baseCurrency == 'UAH') {
      return amount * eurToUahRate;
    }

    if (fromCurrency == 'UAH' && baseCurrency == 'USD') {
      if (usdToUahRate == 0) return 0;
      return amount / usdToUahRate;
    }

    if (fromCurrency == 'UAH' && baseCurrency == 'EUR') {
      if (eurToUahRate == 0) return 0;
      return amount / eurToUahRate;
    }

    if (fromCurrency == 'USD' && baseCurrency == 'EUR') {
      final uah = amount * usdToUahRate;
      if (eurToUahRate == 0) return 0;
      return uah / eurToUahRate;
    }

    if (fromCurrency == 'EUR' && baseCurrency == 'USD') {
      final uah = amount * eurToUahRate;
      if (usdToUahRate == 0) return 0;
      return uah / usdToUahRate;
    }

    return amount;
  }
}
