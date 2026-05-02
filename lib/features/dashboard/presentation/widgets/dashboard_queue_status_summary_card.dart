import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_queue_status_summary_provider.dart';

class DashboardQueueStatusSummaryCard extends StatelessWidget {
  final DashboardQueueStatusSummaryModel model;

  const DashboardQueueStatusSummaryCard({
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
              model.label,
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
                Chip(label: Text('Buy ${model.buyQueue}')),
                Chip(label: Text('Sell ${model.sellQueue}')),
                Chip(label: Text('Reprice ${model.repriceQueue}')),
                Chip(label: Text('Review ${model.reviewQueue}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
