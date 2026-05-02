import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/operator/application/operator_health_summary_provider.dart';

class DashboardOperatorHealthCard extends StatelessWidget {
  final OperatorHealthSummaryModel model;

  const DashboardOperatorHealthCard({
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
                Chip(label: Text('Pending ${model.pendingMatches}')),
                Chip(label: Text('Stale sources ${model.staleSources}')),
                Chip(label: Text('Error sources ${model.errorSources}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
