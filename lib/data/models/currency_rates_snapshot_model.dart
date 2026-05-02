// lib/data/models/currency_rates_snapshot_model.dart

import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class CurrencyRatesSnapshotModel {
  final DateTime fetchedAt;
  final List<CurrencyRateModel> rates;

  const CurrencyRatesSnapshotModel({
    required this.fetchedAt,
    required this.rates,
  });

  Map<String, dynamic> toMap() {
    return {
      'fetchedAt': fetchedAt.toIso8601String(),
      'rates': rates.map((e) => e.toMap()).toList(),
    };
  }

  factory CurrencyRatesSnapshotModel.fromMap(Map<String, dynamic> map) {
    return CurrencyRatesSnapshotModel(
      fetchedAt: DateTime.parse(map['fetchedAt'] as String),
      rates: (map['rates'] as List)
          .map(
            (e) => CurrencyRateModel.fromMap(
              Map<String, dynamic>.from(e as Map),
            ),
          )
          .toList(),
    );
  }
}
