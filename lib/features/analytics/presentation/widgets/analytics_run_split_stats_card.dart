import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_split_stats_model.dart';

class AnalyticsRunSplitStatsCard extends ConsumerWidget {
  final AnalyticsRunSplitStatsModel model;

  const AnalyticsRunSplitStatsCard({
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
            Chip(label: Text('${i18n.t('Manual runs:')} ${model.manualRuns}')),
            Chip(label: Text('${i18n.t('Scheduled runs:')} ${model.scheduledRuns}')),
          ],
        ),
      ),
    );
  }
}