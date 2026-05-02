import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_stability_model.dart';

class AnalyticsAutomationStabilityCard extends StatelessWidget {
  final AnalyticsAutomationStabilityModel model;

  const AnalyticsAutomationStabilityCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = !model.scheduleEnabled
        ? Colors.grey
        : model.totalRuns >= 12
            ? Colors.green
            : model.totalRuns >= 5
                ? Colors.blue
                : Colors.orange;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                model.label,
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            Text(
              model.totalRuns.toString(),
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
