import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rule_health_model.dart';

class AnalyticsAutoRuleHealthCard extends StatelessWidget {
  final AnalyticsAutoRuleHealthModel model;

  const AnalyticsAutoRuleHealthCard({
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
                Chip(label: Text('Disabled ${model.disabledRules}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
