import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_scheduled_run_log_entry_model.dart';

class AnalyticsScheduledRunLogCard extends StatelessWidget {
  final List<AnalyticsScheduledRunLogEntryModel> items;
  final VoidCallback onClear;

  const AnalyticsScheduledRunLogCard({
    super.key,
    required this.items,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(14),
          child: Text('No scheduled run log yet.'),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Scheduled Run Log',
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                    ),
                  ),
                ),
                TextButton(
                  onPressed: onClear,
                  child: const Text('Clear'),
                ),
              ],
            ),
            const SizedBox(height: 10),
            ...items.take(5).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      '${item.createdAt.toIso8601String().split("T").first} • '
                      '${item.frequency} • '
                      'affected ${item.affectedItems}',
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}