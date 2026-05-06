import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_timeline_summary_provider.dart';

class ActivitySummaryBar extends ConsumerWidget {
  final ActivitySummaryModel model;

  const ActivitySummaryBar({
    super.key,
    required this.model,
  });

  Widget _chip(String label, int value, I18nNotifier i18n) {
    return Chip(label: Text('${i18n.t(label)}: $value'));
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          children: [
            _chip('Reports', model.reports, i18n),
            _chip('Purchases', model.purchases, i18n),
            _chip('Sales', model.sales, i18n),
            _chip('Watchlist', model.watchlist, i18n),
          ],
        ),
      ),
    );
  }
}