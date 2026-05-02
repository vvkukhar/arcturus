// lib/data/models/manual_currency_rate_model.dart

class ManualCurrencyRateModel {
  final String id;
  final String code;
  final double rateToUah;
  final DateTime updatedAt;

  const ManualCurrencyRateModel({
    this.id = '',
    required this.code,
    required this.rateToUah,
    required this.updatedAt,
  });

  ManualCurrencyRateModel copyWith({
    String? id,
    String? code,
    double? rateToUah,
    DateTime? updatedAt,
  }) {
    return ManualCurrencyRateModel(
      id: id ?? this.id,
      code: code ?? this.code,
      rateToUah: rateToUah ?? this.rateToUah,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'code': code,
      'rateToUah': rateToUah,
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory ManualCurrencyRateModel.fromMap(Map<String, dynamic> map) {
    return ManualCurrencyRateModel(
      id: map['id'] as String? ?? '',
      code: map['code'] as String,
      rateToUah: (map['rateToUah'] as num).toDouble(),
      updatedAt: DateTime.parse(map['updatedAt'] as String),
    );
  }
}
