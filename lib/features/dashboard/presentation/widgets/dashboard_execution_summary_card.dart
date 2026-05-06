import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_execution_summary_provider.dart';

class DashboardExecutionSummaryCard extends ConsumerWidget {
  final DashboardExecutionSummaryModel model;

  const DashboardExecutionSummaryCard({
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
              i18n.t(model.headline),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text('${i18n.t('Purchase pending')} ${model.purchasePending}')),
                Chip(label: Text('${i18n.t('Bought')} ${model.purchaseBought}')),
                Chip(label: Text('${i18n.t('Reprice pending')} ${model.repricePending}')),
                Chip(label: Text('${i18n.t('Listed')} ${model.repriceListed}')),
                Chip(label: Text('${i18n.t('Review pending')} ${model.reviewPending}')),
                Chip(label: Text('${i18n.t('Reviewed')} ${model.reviewDone}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}