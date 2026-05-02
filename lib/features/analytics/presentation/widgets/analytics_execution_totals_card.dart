import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_totals_model.dart';

class AnalyticsExecutionTotalsCard extends StatelessWidget {
  final AnalyticsExecutionTotalsModel model;

  const AnalyticsExecutionTotalsCard({
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
                _cell('Manual', model.manualRuns.toString()),
                _cell('Scheduled', model.scheduledRuns.toString()),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Total runs', model.totalRuns.toString()),
                _cell('Affected', model.totalAffectedItems.toString()),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
