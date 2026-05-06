import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_top_type_summary_model.dart';

class ActivityTopTypeSummaryCard extends ConsumerWidget {
  final List<ActivityTopTypeSummaryModel> items;

  const ActivityTopTypeSummaryCard({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    if (items.isEmpty) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: items.take(5).map((item) {
            return Chip(label: Text('${i18n.t(item.type)}: ${item.count}'));
          }).toList(),
        ),
      ),
    );
  }
}