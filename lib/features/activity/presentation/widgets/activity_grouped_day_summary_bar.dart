import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_model.dart';

class ActivityGroupedDaySummaryBar extends ConsumerWidget {
  final List<ActivityGroupedDaySummaryModel> items;

  const ActivityGroupedDaySummaryBar({
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
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: items.take(3).map((item) {
            return Chip(
              label: Text('${i18n.t(item.dateLabel)}: ${item.total}'),
            );
          }).toList(),
        ),
      ),
    );
  }
}