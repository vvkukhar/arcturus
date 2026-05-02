import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sales/application/sales_profit_summary_model.dart';

class SalesProfitSummaryCard extends StatelessWidget {
  final SalesProfitSummaryModel model;
  final String currency;

  const SalesProfitSummaryCard({
    super.key,
    required this.model,
    required this.currency,
  });

  Color _profitColor() {
    if (model.totalProfit > 0) return Colors.green;
    if (model.totalProfit == 0) return Colors.orange;
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
    final profitColor = _profitColor();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Profit Summary',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Sales', model.totalSales.toString()),
                _cell('Matched', model.matchedSales.toString()),
                _cell('Unmatched', model.unmatchedSales.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Units', '${model.matchedUnits}/${model.totalUnits}'),
                _cell('Open units', model.unmatchedUnits.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(
                  'Net',
                  '${model.totalNet.toStringAsFixed(2)} $currency',
                ),
                _cell(
                  'Cost',
                  '${model.totalPurchaseCost.toStringAsFixed(2)} $currency',
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(
                  'Profit',
                  '${model.totalProfit.toStringAsFixed(2)} $currency',
                  color: profitColor,
                ),
                _cell(
                  'Avg ROI',
                  '${model.averageRoiPercent.toStringAsFixed(1)}%',
                  color: profitColor,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell(
                  'Avg unit profit',
                  '${model.averageUnitProfit.toStringAsFixed(2)} $currency',
                  color: profitColor,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}