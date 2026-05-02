import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/application/activity_balance_summary_model.dart';

class ActivityBalanceSummaryCard extends StatelessWidget {
  final ActivityBalanceSummaryModel model;

  const ActivityBalanceSummaryCard({
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
            Chip(label: Text('Reports ${model.reports}')),
            Chip(label: Text('Purchases ${model.purchases}')),
            Chip(label: Text('Sales ${model.sales}')),
            Chip(label: Text('Other ${model.other}')),
          ],
        ),
      ),
    );
  }
}
