import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sales/application/sales_metrics_provider.dart';

class SalesMetricsCard extends StatelessWidget {
  final SalesMetricsModel model;

  const SalesMetricsCard({
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
            style: const TextStyle(fontWeight: FontWeight.w800),
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
                _cell('Sales', '${model.visibleCount}/${model.totalCount}'),
                _cell('Units', '${model.visibleUnits}/${model.totalUnits}'),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Gross', model.visibleRevenue.toStringAsFixed(2)),
                _cell('Net', model.totalNet.toStringAsFixed(2)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Fees', model.totalFees.toStringAsFixed(2)),
                _cell('Shipping', model.totalShippingByMe.toStringAsFixed(2)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Avg net', model.averageNet.toStringAsFixed(2)),
                _cell('Avg unit net', model.averageUnitNet.toStringAsFixed(2)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}