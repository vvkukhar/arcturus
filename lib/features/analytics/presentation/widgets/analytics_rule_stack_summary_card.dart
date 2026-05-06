import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_stack_summary_model.dart';

class AnalyticsRuleStackSummaryCard extends ConsumerWidget {
  final AnalyticsRuleStackSummaryModel model;

  const AnalyticsRuleStackSummaryCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

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
                Chip(label: Text('${i18n.t('Enabled')} ${model.enabledRules}')),
                Chip(
                    label:
                        Text(model.scheduleEnabled ? i18n.t('Scheduled') : i18n.t('Manual'))),
                Chip(label: Text(i18n.t(model.frequency))),
              ],
            ),
          ],
        ),
      ),
    );
  }
}