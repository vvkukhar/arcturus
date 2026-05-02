import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_top_type_summary_model.dart';

class ActivityTopTypeSummaryCard extends StatelessWidget {
  final List<ActivityTopTypeSummaryModel> items;

  const ActivityTopTypeSummaryCard({
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
          children: items.take(5).map((item) {
            return Chip(label: Text('${item.type}: ${item.count}'));
          }).toList(),
        ),
      ),
    );
  }
}
