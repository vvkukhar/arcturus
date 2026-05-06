import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_schedule_model.dart';

class AnalyticsRuleScheduleCard extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final frequencies = ['manual', 'daily', 'weekly'];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              value: model.enabled,
              onChanged: onToggle,
              title: Text(i18n.t('Auto-run schedule')),
              subtitle: Text(i18n.t('Foundation only, no background runner yet')),
            ),
            DropdownButtonFormField<String>(
              value: model.frequencyLabel,
              decoration: InputDecoration(labelText: i18n.t('Frequency')),
              items: frequencies
                  .map(
                    (f) => DropdownMenuItem(
                      value: f,
                      child: Text(i18n.t(f)),
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