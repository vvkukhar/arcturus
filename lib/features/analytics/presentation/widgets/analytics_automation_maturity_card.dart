import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_maturity_model.dart';

class AnalyticsAutomationMaturityCard extends StatelessWidget {
  final AnalyticsAutomationMaturityModel model;

  const AnalyticsAutomationMaturityCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = model.scheduleEnabled ? Colors.green : Colors.orange;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              model.label,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text('Enabled rules ${model.enabledRules}')),
                Chip(
                  label: Text(
                      model.scheduleEnabled ? 'Schedule on' : 'Schedule off'),
                  backgroundColor: color.withValues(alpha: 0.15),
                ),
                Chip(label: Text('Runs ${model.totalRuns}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
