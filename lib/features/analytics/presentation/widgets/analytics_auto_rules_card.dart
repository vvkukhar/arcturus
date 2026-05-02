import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rule_model.dart';

class AnalyticsAutoRulesCard extends StatelessWidget {
  final List<AnalyticsAutoRuleModel> items;
  final ValueChanged<String> onToggle;

  const AnalyticsAutoRulesCard({
    super.key,
    required this.items,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    final enabledCount = items.where((item) => item.enabled).length;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Automation Rules',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text('Total ${items.length}')),
                Chip(label: Text('Enabled $enabledCount')),
              ],
            ),
            const SizedBox(height: 8),
            ...items.map(
              (item) => SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(item.title),
                subtitle: Text(item.description),
                value: item.enabled,
                onChanged: (_) => onToggle(item.id),
              ),
            ),
          ],
        ),
      ),
    );
  }
}