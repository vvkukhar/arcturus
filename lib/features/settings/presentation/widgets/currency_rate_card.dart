import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/currency_rate_model.dart';

class CurrencyRateCard extends StatelessWidget {
  final CurrencyRateModel rate;

  const CurrencyRateCard({
    super.key,
    required this.rate,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text('${rate.code} — ${rate.name}'),
        subtitle: Text('Base: ${rate.baseCurrency}'),
        trailing: Text(
          rate.rate.toStringAsFixed(4),
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}