import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_status_counter_model.dart';

class InventoryStatusCounterBar extends StatelessWidget {
  final List<InventoryStatusCounterModel> counters;

  const InventoryStatusCounterBar({
    super.key,
    required this.counters,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: counters
              .map(
                (item) => Chip(
                  label: Text('${item.status.name}: ${item.count}'),
                ),
              )
              .toList(),
        ),
      ),
    );
  }
}