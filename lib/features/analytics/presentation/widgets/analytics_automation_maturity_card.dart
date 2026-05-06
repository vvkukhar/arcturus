import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_maturity_model.dart';

class AnalyticsAutomationMaturityCard extends ConsumerWidget {
  final AnalyticsAutomationMaturityModel model;

  const AnalyticsAutomationMaturityCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final color = model.scheduleEnabled ? Colors.green : Colors.orange;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t(model.label),
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
                Chip(label: Text('${i18n.t('Enabled rules')} ${model.enabledRules}')),
                Chip(
                  label: Text(
                      model.scheduleEnabled ? i18n.t('Schedule on') : i18n.t('Schedule off')),
                  backgroundColor: color.withValues(alpha: 0.15),
                ),
                Chip(label: Text('${i18n.t('Runs')} ${model.totalRuns}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}