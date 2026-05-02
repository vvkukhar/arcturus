import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_split_stats_model.dart';

class AnalyticsRunSplitStatsCard extends StatelessWidget {
  final AnalyticsRunSplitStatsModel model;

  const AnalyticsRunSplitStatsCard({
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
            Chip(label: Text('Manual runs: ${model.manualRuns}')),
            Chip(label: Text('Scheduled runs: ${model.scheduledRuns}')),
          ],
        ),
      ),
    );
  }
}
