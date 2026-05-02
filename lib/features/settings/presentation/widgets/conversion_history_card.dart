import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/currency_conversion_record_model.dart';

class ConversionHistoryCard extends StatelessWidget {
  final CurrencyConversionRecordModel item;

  const ConversionHistoryCard({
    super.key,
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(
          '${item.inputAmount.toStringAsFixed(2)} ${item.fromCurrency} → ${item.outputAmount.toStringAsFixed(2)} ${item.toCurrency}',
        ),
        subtitle: Text('Rate: ${item.rate.toStringAsFixed(4)}'),
        trailing: Text(item.createdAt.toIso8601String().split('T').first),
      ),
    );
  }
}