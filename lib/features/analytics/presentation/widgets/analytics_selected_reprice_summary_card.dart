import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_selected_reprice_summary_model.dart';

class AnalyticsSelectedRepriceSummaryCard extends StatelessWidget {
  final AnalyticsSelectedRepriceSummaryModel model;

  const AnalyticsSelectedRepriceSummaryCard({
    super.key,
    required this.model,
  });

  Widget _cell(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (model.count == 0) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            _cell('Selected', model.count.toString()),
            _cell('Current', model.currentTotal.toStringAsFixed(2)),
            _cell('Suggested', model.suggestedTotal.toStringAsFixed(2)),
            _cell('Delta', model.delta.toStringAsFixed(2)),
          ],
        ),
      ),
    );
  }
}