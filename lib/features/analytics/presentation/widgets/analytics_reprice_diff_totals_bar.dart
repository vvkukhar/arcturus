import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_diff_totals_model.dart';

class AnalyticsRepriceDiffTotalsBar extends StatelessWidget {
  final AnalyticsRepriceDiffTotalsModel model;

  const AnalyticsRepriceDiffTotalsBar({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('Raised: ${model.raisedCount}')),
            Chip(label: Text('Lowered: ${model.loweredCount}')),
            Chip(label: Text('+${model.positiveDelta.toStringAsFixed(2)}')),
            Chip(label: Text('-${model.negativeDelta.toStringAsFixed(2)}')),
          ],
        ),
      ),
    );
  }
}
