import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_metrics_provider.dart';

class WatchlistMetricsCard extends StatelessWidget {
  final WatchlistMetricsModel metrics;

  const WatchlistMetricsCard({
    super.key,
    required this.metrics,
  });

  @override
  Widget build(BuildContext context) {
    Widget row(String label, String value) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            Expanded(child: Text(label)),
            Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ],
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            row('Total', metrics.totalCount.toString()),
            row('Visible', metrics.visibleCount.toString()),
            row('Active', metrics.activeCount.toString()),
            row('Inactive', metrics.inactiveCount.toString()),
            row('With Market Price', metrics.withMarketCount.toString()),
            row('Good Opportunities', metrics.opportunityCount.toString()),
          ],
        ),
      ),
    );
  }
}
