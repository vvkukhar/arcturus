import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_model.dart';
import 'package:lego_trading_manager/features/activity/presentation/widgets/activity_copy_summary_button.dart';

class ActivityExportSummaryCard extends StatelessWidget {
  final List<ActivityGroupedDaySummaryModel> items;

  const ActivityExportSummaryCard({
    super.key,
    required this.items,
  });

  String _buildText() {
    if (items.isEmpty) return 'No activity summary available.';
    return items.take(7).map((item) {
      return '${item.dateLabel}: total=${item.total}, reports=${item.reports}, purchases=${item.purchases}, sales=${item.sales}';
    }).join('\n');
  }

  @override
  Widget build(BuildContext context) {
    final text = _buildText();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ActivityCopySummaryButton(text: text),
            const SizedBox(height: 10),
            SelectableText(
              text,
              style: const TextStyle(height: 1.4),
            ),
          ],
        ),
      ),
    );
  }
}
