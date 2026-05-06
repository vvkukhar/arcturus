import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_flow_counters_provider.dart';

class DashboardFlowCountersCard extends ConsumerWidget {
  final DashboardFlowCountersModel model;

  const DashboardFlowCountersCard({
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
                Chip(label: Text('${i18n.t('Purchase')} ${model.purchaseFlow}')),
                Chip(label: Text('${i18n.t('Reprice')} ${model.repriceFlow}')),
                Chip(label: Text('${i18n.t('Review done')} ${model.reviewDone}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}