import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sales_allocated_profit_summary_model.dart';

class SalesAllocatedProfitSummaryCard extends StatelessWidget {
  final SalesAllocatedProfitSummaryModel model;
  final String currency;

  const SalesAllocatedProfitSummaryCard({
    super.key,
    required this.model,
    required this.currency,
  });

  Color _color() {
    if (model.allocatedProfit > 0) return Colors.green;
    if (model.allocatedProfit == 0) return Colors.orange;
    return Colors.redAccent;
  }

  Widget _cell(String label, String value, {Color? color}) {
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
            style: TextStyle(
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Allocated Profit',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Sales', model.totalSales.toString()),
                _cell('Allocated', model.allocatedSales.toString()),
                _cell('Open', model.unallocatedSales.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Units', '${model.allocatedUnits}/${model.totalUnits}'),
                _cell('Open units', model.unallocatedUnits.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(
                  'Cost',
                  '${model.allocatedCost.toStringAsFixed(2)} $currency',
                ),
                _cell(
                  'Profit',
                  '${model.allocatedProfit.toStringAsFixed(2)} $currency',
                  color: color,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(
                  'Avg ROI',
                  '${model.averageAllocatedRoiPercent.toStringAsFixed(1)}%',
                  color: color,
                ),
                _cell(
                  'Avg unit profit',
                  '${model.averageUnitProfit.toStringAsFixed(2)} $currency',
                  color: color,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}