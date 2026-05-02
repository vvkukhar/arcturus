// lib/data/models/currency_rate_model.dart

class CurrencyRateModel {
  final String code;
  final String? name;
  final double rate;
  final String baseCurrency;
  final DateTime fetchedAt;
  final String source;
  final int units;
  final bool? special;

  const CurrencyRateModel({
    required this.code,
    required this.rate,
    required this.baseCurrency,
    required this.fetchedAt,
    this.name,
    this.source = 'unknown',
    this.units = 1,
    this.special,
  });

  double get rateToUah => rate;

  CurrencyRateModel copyWith({
    String? code,
    String? name,
    double? rate,
    String? baseCurrency,
    DateTime? fetchedAt,
    String? source,
    int? units,
    bool? special,
  }) {
    return CurrencyRateModel(
      code: code ?? this.code,
      name: name ?? this.name,
      rate: rate ?? this.rate,
      baseCurrency: baseCurrency ?? this.baseCurrency,
      fetchedAt: fetchedAt ?? this.fetchedAt,
      source: source ?? this.source,
      units: units ?? this.units,
      special: special ?? this.special,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'code': code,
      'name': name,
      'rate': rate,
      'baseCurrency': baseCurrency,
      'fetchedAt': fetchedAt.toIso8601String(),
      'source': source,
      'units': units,
      'special': special,
    };
  }

  factory CurrencyRateModel.fromMap(Map<String, dynamic> map) {
    return CurrencyRateModel(
      code: map['code'] as String? ?? '',
      name: map['name'] as String?,
      rate: (map['rate'] as num?)?.toDouble() ??
          (map['rateToUah'] as num?)?.toDouble() ??
          0.0,
      baseCurrency: map['baseCurrency'] as String? ?? 'UAH',
      fetchedAt: map['fetchedAt'] != null
          ? DateTime.parse(map['fetchedAt'] as String)
          : DateTime.now(),
      source: map['source'] as String? ?? 'unknown',
      units: map['units'] as int? ?? 1,
      special: map['special'] as bool?,
    );
  }
}
