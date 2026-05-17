class CurrencyConverter {
  final String baseCurrency;
  final double usdRate;
  final double eurRate;
  final double cadRate;
  final double gbpRate;

  const CurrencyConverter({
    required this.baseCurrency,
    required this.usdRate,
    required this.eurRate,
    required this.cadRate,
    required this.gbpRate,
  });

  double call(double amount, {String from = 'UAH'}) {
    if (from == baseCurrency) return amount;
    
    double inUah = amount;
    if (from == 'USD') { inUah = amount * usdRate; }
    else if (from == 'EUR') { inUah = amount * eurRate; }
    else if (from == 'CAD') { inUah = amount * cadRate; }
    else if (from == 'GBP') { inUah = amount * gbpRate; }

    if (baseCurrency == 'UAH') return inUah;
    if (baseCurrency == 'USD') return inUah / usdRate;
    if (baseCurrency == 'EUR') return inUah / eurRate;
    if (baseCurrency == 'CAD') return inUah / cadRate;
    if (baseCurrency == 'GBP') return inUah / gbpRate;
    
    return inUah;
  }
}