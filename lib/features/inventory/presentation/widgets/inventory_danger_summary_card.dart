import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_danger_summary_model.dart';

class InventoryDangerSummaryCard extends StatelessWidget {
  final InventoryDangerSummaryModel model;

  const InventoryDangerSummaryCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('Low profit: ${model.lowProfitCount}')),
            Chip(label: Text('High risk: ${model.highRiskCount}')),
            Chip(label: Text('Both: ${model.bothCount}')),
          ],
        ),
      ),
    );
  }
}
