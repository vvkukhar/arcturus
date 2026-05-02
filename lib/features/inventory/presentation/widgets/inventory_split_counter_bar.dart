import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_split_counter_model.dart';

class InventorySplitCounterBar extends StatelessWidget {
  final InventorySplitCounterModel model;

  const InventorySplitCounterBar({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('Active: ${model.active}')),
            Chip(label: Text('Archived: ${model.archived}')),
          ],
        ),
      ),
    );
  }
}