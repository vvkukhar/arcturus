// lib/data/models/currency_conversion_record_model.dart

class CurrencyConversionRecordModel {
  final String id;
  final String fromCurrency;
  final String toCurrency;
  final double inputAmount;
  final double rate;
  final double outputAmount;
  final DateTime createdAt;

  const CurrencyConversionRecordModel({
    required this.id,
    required this.fromCurrency,
    required this.toCurrency,
    required this.inputAmount,
    required this.rate,
    required this.outputAmount,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'fromCurrency': fromCurrency,
      'toCurrency': toCurrency,
      'inputAmount': inputAmount,
      'rate': rate,
      'outputAmount': outputAmount,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory CurrencyConversionRecordModel.fromMap(Map<String, dynamic> map) {
    return CurrencyConversionRecordModel(
      id: map['id'] as String,
      fromCurrency: map['fromCurrency'] as String,
      toCurrency: map['toCurrency'] as String,
      inputAmount: (map['inputAmount'] as num).toDouble(),
      rate: (map['rate'] as num).toDouble(),
      outputAmount: (map['outputAmount'] as num).toDouble(),
      createdAt: DateTime.parse(map['createdAt'] as String),
    );
  }
}
