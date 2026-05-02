import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_severity_summary_model.dart';

class InventoryAlertSeveritySummaryCard extends StatelessWidget {
  final InventoryAlertSeveritySummaryModel model;

  const InventoryAlertSeveritySummaryCard({
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
            Chip(label: Text('Low: ${model.low}')),
            Chip(label: Text('Medium: ${model.medium}')),
            Chip(label: Text('High: ${model.high}')),
          ],
        ),
      ),
    );
  }
}
