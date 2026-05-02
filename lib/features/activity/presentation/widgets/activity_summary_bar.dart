import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_timeline_summary_provider.dart';

class ActivitySummaryBar extends StatelessWidget {
  final ActivitySummaryModel model;

  const ActivitySummaryBar({
    super.key,
    required this.model,
  });

  Widget _chip(String label, int value) {
    return Chip(label: Text('$label: $value'));
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          children: [
            _chip('Reports', model.reports),
            _chip('Purchases', model.purchases),
            _chip('Sales', model.sales),
            _chip('Watchlist', model.watchlist),
          ],
        ),
      ),
    );
  }
}
