import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_pressure_summary_model.dart';

class AnalyticsAutomationPressureSummaryCard extends StatelessWidget {
  final AnalyticsAutomationPressureSummaryModel model;

  const AnalyticsAutomationPressureSummaryCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
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
              '${model.enabledRules} rules',
              style: const TextStyle(
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
