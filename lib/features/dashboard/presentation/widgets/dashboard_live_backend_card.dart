import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_flow_counters_api_provider.dart';

class DashboardLiveBackendCard extends StatelessWidget {
  final DashboardFlowCountersApiModel model;

  const DashboardLiveBackendCard({
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
            Chip(label: Text('Purchase ${model.purchase}')),
            Chip(label: Text('Reprice ${model.reprice}')),
            Chip(label: Text('Review ${model.review}')),
          ],
        ),
      ),
    );
  }
}