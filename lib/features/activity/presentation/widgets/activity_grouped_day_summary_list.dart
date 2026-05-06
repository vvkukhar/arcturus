import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_model.dart';

class ActivityGroupedDaySummaryList extends ConsumerWidget {
  final List<ActivityGroupedDaySummaryModel> items;

  const ActivityGroupedDaySummaryList({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (items.isEmpty) return const SizedBox.shrink();

    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t('Day Summaries'),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.take(7).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        Chip(label: Text(i18n.t(item.dateLabel))),
                        Chip(label: Text('${i18n.t('Total')} ${item.total}')),
                        Chip(label: Text('${i18n.t('Reports')} ${item.reports}')),
                        Chip(label: Text('${i18n.t('Purchases')} ${item.purchases}')),
                        Chip(label: Text('${i18n.t('Sales')} ${item.sales}')),
                      ],
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}