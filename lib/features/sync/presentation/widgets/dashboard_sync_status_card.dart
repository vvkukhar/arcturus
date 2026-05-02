import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sync/application/dashboard_sync_summary_provider.dart';

class DashboardSyncStatusCard extends StatelessWidget {
  final DashboardSyncSummaryModel model;

  const DashboardSyncStatusCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final headline = model.stale + model.veryStale + model.missing > 0
        ? 'Some market data needs refresh'
        : 'Market sync looks healthy';

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              headline,
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
                Chip(label: Text('Fresh ${model.fresh}')),
                Chip(label: Text('Recent ${model.recent}')),
                Chip(label: Text('Aging ${model.aging}')),
                Chip(label: Text('Stale ${model.stale}')),
                Chip(label: Text('Very stale ${model.veryStale}')),
                Chip(label: Text('Missing ${model.missing}')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}