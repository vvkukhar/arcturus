import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_diff_totals_model.dart';

class AnalyticsRepriceDiffTotalsBar extends ConsumerWidget {
  final AnalyticsRepriceDiffTotalsModel model;

  const AnalyticsRepriceDiffTotalsBar({
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
            Chip(label: Text('${i18n.t('Raised')}: ${model.raisedCount}')),
            Chip(label: Text('${i18n.t('Lowered')}: ${model.loweredCount}')),
            Chip(label: Text('+${model.positiveDelta.toStringAsFixed(2)}')),
            Chip(label: Text('-${model.negativeDelta.toStringAsFixed(2)}')),
          ],
        ),
      ),
    );
  }
}