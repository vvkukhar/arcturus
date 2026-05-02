import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_profit_summary_model.dart';

class AnalyticsProfitSummaryCard extends StatelessWidget {
  final AnalyticsProfitSummaryModel model;

  const AnalyticsProfitSummaryCard({
    super.key,
    required this.model,
  });

  Widget _row(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.w800,
              color: valueColor,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final profitColor =
        model.totalExpectedProfit >= 0 ? Colors.green : Colors.redAccent;
    final roiColor = model.roiPercent >= 0 ? Colors.green : Colors.redAccent;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _row('Total Cost', model.totalCost.toStringAsFixed(2)),
            _row(
              'Expected Revenue',
              model.totalExpectedRevenue.toStringAsFixed(2),
            ),
            _row(
              'Expected Profit',
              model.totalExpectedProfit.toStringAsFixed(2),
              valueColor: profitColor,
            ),
            _row(
              'ROI',
              '${model.roiPercent.toStringAsFixed(1)}%',
              valueColor: roiColor,
            ),
          ],
        ),
      ),
    );
  }
}