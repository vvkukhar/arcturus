import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_efficiency_model.dart';

class AnalyticsExecutionEfficiencyCard extends StatelessWidget {
  final AnalyticsExecutionEfficiencyModel model;

  const AnalyticsExecutionEfficiencyCard({
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
        child: Row(
          children: [
            _cell('Runs', model.totalRuns.toString()),
            _cell('Affected', model.totalAffected.toString()),
            _cell('Avg/run', model.avgAffectedPerRun.toStringAsFixed(1)),
          ],
        ),
      ),
    );
  }
}
