import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_model.dart';

class ActivityGroupedDaySummaryBar extends StatelessWidget {
  final List<ActivityGroupedDaySummaryModel> items;

  const ActivityGroupedDaySummaryBar({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: items.take(3).map((item) {
            return Chip(
              label: Text('${item.dateLabel}: ${item.total}'),
            );
          }).toList(),
        ),
      ),
    );
  }
}
