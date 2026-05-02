class CurrencyConverterState {
  final String fromCurrency;
  final String toCurrency;
  final double inputAmount;
  final double rate;
  final double outputAmount;

  const CurrencyConverterState({
    required this.fromCurrency,
    required this.toCurrency,
    required this.inputAmount,
    required this.rate,
    required this.outputAmount,
  });

  factory CurrencyConverterState.initial() {
    return const CurrencyConverterState(
      fromCurrency: 'USD',
      toCurrency: 'UAH',
      inputAmount: 0,
      rate: 1,
      outputAmount: 0,
    );
  }

  CurrencyConverterState copyWith({
    String? fromCurrency,
    String? toCurrency,
    double? inputAmount,
    double? rate,
    double? outputAmount,
  }) {
    return CurrencyConverterState(
      fromCurrency: fromCurrency ?? this.fromCurrency,
      toCurrency: toCurrency ?? this.toCurrency,
      inputAmount: inputAmount ?? this.inputAmount,
      rate: rate ?? this.rate,
      outputAmount: outputAmount ?? this.outputAmount,
    );
  }
}