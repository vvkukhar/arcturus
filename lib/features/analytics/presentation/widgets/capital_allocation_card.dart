import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/capital_allocation_entry_model.dart';

class CapitalAllocationCard extends StatelessWidget {
  final CapitalAllocationEntryModel entry;

  const CapitalAllocationCard({
    super.key,
    required this.entry,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(entry.label),
        trailing: Text(
          entry.amount.toStringAsFixed(2),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}