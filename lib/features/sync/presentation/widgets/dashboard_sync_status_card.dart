import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/sync/application/dashboard_sync_summary_provider.dart';

class DashboardSyncStatusCard extends ConsumerWidget {
  final DashboardSyncSummaryModel model;

  const DashboardSyncStatusCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final headline = model.stale + model.veryStale + model.missing > 0
        ? 'Some market data needs refresh'
        : 'Market sync looks healthy';

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t(headline),
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
                Chip(label: Text('${i18n.t('Fresh')} ${model.fresh}')),
                Chip(label: Text('${i18n.t('Recent')} ${model.recent}')),
                Chip(label: Text('${i18n.t('Aging')} ${model.aging}')),
                Chip(label: Text('${i18n.t('Stale')} ${model.stale}')),
                Chip(label: Text('Very stale ${model.veryStale}')),
                Chip(label: Text('${i18n.t('Missing')} ${model.missing}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}