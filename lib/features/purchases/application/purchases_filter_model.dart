class PurchasesFilterModel {
  final String? sourceContains;
  final String? currency;
  final double? minTotal;
  final double? maxTotal;

  const PurchasesFilterModel({
    this.sourceContains,
    this.currency,
    this.minTotal,
    this.maxTotal,
  });

  static const empty = PurchasesFilterModel();

  bool get hasAnyFilter {
    return (sourceContains?.trim().isNotEmpty ?? false) ||
        (currency?.trim().isNotEmpty ?? false) ||
        minTotal != null ||
        maxTotal != null;
  }

  PurchasesFilterModel copyWith({
    String? sourceContains,
    String? currency,
    double? minTotal,
    double? maxTotal,
    bool clearSourceContains = false,
    bool clearCurrency = false,
    bool clearMinTotal = false,
    bool clearMaxTotal = false,
  }) {
    return PurchasesFilterModel(
      sourceContains:
          clearSourceContains ? null : sourceContains ?? this.sourceContains,
      currency: clearCurrency ? null : currency ?? this.currency,
      minTotal: clearMinTotal ? null : minTotal ?? this.minTotal,
      maxTotal: clearMaxTotal ? null : maxTotal ?? this.maxTotal,
    );
  }
}