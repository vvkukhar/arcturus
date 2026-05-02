import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_metrics_provider.dart';

class PurchasesMetricsCard extends StatelessWidget {
  final PurchasesMetricsModel model;

  const PurchasesMetricsCard({
    super.key,
    required this.model,
  });

  Widget _cell(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w800,
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
                _cell('Total', model.totalCount.toString()),
                _cell('Visible', model.visibleCount.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Total spend', model.totalSpend.toStringAsFixed(2)),
                _cell('Visible spend', model.visibleSpend.toStringAsFixed(2)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Avg purchase', model.averagePurchase.toStringAsFixed(2)),
                _cell('Avg shipping', model.averageShipping.toStringAsFixed(2)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}