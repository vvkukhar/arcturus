import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_model.dart';

class ActivityGroupedDaySummaryList extends StatelessWidget {
  final List<ActivityGroupedDaySummaryModel> items;

  const ActivityGroupedDaySummaryList({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Day Summaries',
              style: TextStyle(
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
                        Chip(label: Text(item.dateLabel)),
                        Chip(label: Text('Total ${item.total}')),
                        Chip(label: Text('Reports ${item.reports}')),
                        Chip(label: Text('Purchases ${item.purchases}')),
                        Chip(label: Text('Sales ${item.sales}')),
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
