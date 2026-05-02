import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/deals/application/deal_history_entry_model.dart';

class DealHistoryCard extends StatelessWidget {
  final DealHistoryEntryModel entry;

  const DealHistoryCard({
    super.key,
    required this.entry,
  });

  Color _color() {
    switch (entry.verdict) {
      case 'strong buy':
        return Colors.green;
      case 'good':
        return Colors.lightGreen;
      case 'weak':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

    return Card(
      child: ListTile(
        title: Text(entry.title),
        subtitle: Text(
          'ask ${entry.askingPrice.toStringAsFixed(2)} | '
          'market ${entry.marketPrice.toStringAsFixed(2)} | '
          'margin ${entry.marginPercent.toStringAsFixed(1)}%',
        ),
        trailing: Text(
          entry.verdict,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}
