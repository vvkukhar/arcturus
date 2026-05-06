import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_balance_summary_model.dart';

class ActivityBalanceSummaryCard extends ConsumerWidget {
  final ActivityBalanceSummaryModel model;

  const ActivityBalanceSummaryCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('${i18n.t('Reports')} ${model.reports}')),
            Chip(label: Text('${i18n.t('Purchases')} ${model.purchases}')),
            Chip(label: Text('${i18n.t('Sales')} ${model.sales}')),
            Chip(label: Text('${i18n.t('Other')} ${model.other}')),
          ],
        ),
      ),
    );
  }
}