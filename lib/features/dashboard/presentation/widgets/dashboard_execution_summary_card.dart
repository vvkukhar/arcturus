import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_execution_summary_provider.dart';

class DashboardExecutionSummaryCard extends StatelessWidget {
  final DashboardExecutionSummaryModel model;

  const DashboardExecutionSummaryCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              model.headline,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text('Purchase pending ${model.purchasePending}')),
                Chip(label: Text('Bought ${model.purchaseBought}')),
                Chip(label: Text('Reprice pending ${model.repricePending}')),
                Chip(label: Text('Listed ${model.repriceListed}')),
                Chip(label: Text('Review pending ${model.reviewPending}')),
                Chip(label: Text('Reviewed ${model.reviewDone}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
