import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_entry_model.dart';

class DeadStockCard extends StatelessWidget {
  final DeadStockEntryModel entry;

  const DeadStockCard({
    super.key,
    required this.entry,
  });

  Color _color() {
    switch (entry.severity) {
      case 'critical':
        return Colors.red;
      case 'warning':
        return Colors.orange;
      default:
        return Colors.yellow;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

    return Card(
      child: ListTile(
        leading: Icon(Icons.warning_amber_rounded, color: color),
        title: Text(entry.title),
        subtitle: Text(
          '${entry.days} days • capital ${entry.capital.toStringAsFixed(2)}',
        ),
        trailing: Text(
          entry.severity,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}