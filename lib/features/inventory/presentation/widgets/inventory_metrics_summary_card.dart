import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_metrics_summary_model.dart';

class InventoryMetricsSummaryCard extends StatelessWidget {
  final InventoryMetricsSummaryModel model;

  const InventoryMetricsSummaryCard({
    super.key,
    required this.model,
  });

  Widget _cell(String title, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 15,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                _cell('Items', model.totalItems.toString()),
                _cell('Tracked', model.trackedItems.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Cost', model.totalCost.toStringAsFixed(2)),
                _cell('Revenue', model.expectedRevenue.toStringAsFixed(2)),
                _cell('Profit', model.expectedProfit.toStringAsFixed(2)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}