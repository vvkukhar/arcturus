import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_stack_summary_model.dart';

class AnalyticsRuleStackSummaryCard extends StatelessWidget {
  final AnalyticsRuleStackSummaryModel model;

  const AnalyticsRuleStackSummaryCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
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
                Chip(label: Text('Enabled ${model.enabledRules}')),
                Chip(
                    label:
                        Text(model.scheduleEnabled ? 'Scheduled' : 'Manual')),
                Chip(label: Text(model.frequency)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
