import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/manual_currency_rate_model.dart';

class ManualRateCard extends StatelessWidget {
  final ManualCurrencyRateModel rate;

  const ManualRateCard({
    super.key,
    required this.rate,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(rate.code),
        subtitle: Text(
          'Saved: ${rate.updatedAt.toIso8601String().split('T').first}',
        ),
        trailing: Text(
          rate.rateToUah.toStringAsFixed(4),
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}