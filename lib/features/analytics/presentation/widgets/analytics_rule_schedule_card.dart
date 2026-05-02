import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_schedule_model.dart';

class AnalyticsRuleScheduleCard extends StatelessWidget {
  final AnalyticsRuleScheduleModel model;
  final ValueChanged<bool> onToggle;
  final ValueChanged<String?> onFrequencyChanged;

  const AnalyticsRuleScheduleCard({
    super.key,
    required this.model,
    required this.onToggle,
    required this.onFrequencyChanged,
  });

  @override
  Widget build(BuildContext context) {
    const frequencies = ['manual', 'daily', 'weekly'];
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              value: model.enabled,
              onChanged: onToggle,
              title: const Text('Auto-run schedule'),
              subtitle: const Text('Foundation only, no background runner yet'),
            ),
            DropdownButtonFormField<String>(
              value: model.frequencyLabel,
              decoration: const InputDecoration(labelText: 'Frequency'),
              items: frequencies
                  .map(
                    (f) => DropdownMenuItem(
                      value: f,
                      child: Text(f),
                    ),
                  )
                  .toList(),
              onChanged: onFrequencyChanged,
            ),
          ],
        ),
      ),
    );
  }
}
