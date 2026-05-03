import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_flow_counters_provider.dart';

class DashboardFlowCountersCard extends StatelessWidget {
  final DashboardFlowCountersModel model;

  const DashboardFlowCountersCard({
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
                Chip(label: Text('Purchase ${model.purchaseFlow}')),
                Chip(label: Text('Reprice ${model.repriceFlow}')),
                Chip(label: Text('Review done ${model.reviewDone}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}