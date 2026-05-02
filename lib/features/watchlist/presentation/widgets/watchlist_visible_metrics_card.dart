// lib/features/watchlist/presentation/widgets/watchlist_visible_metrics_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_visible_metrics_provider.dart';

class WatchlistVisibleMetricsCard extends StatelessWidget {
  final WatchlistVisibleMetricsModel metrics;

  const WatchlistVisibleMetricsCard({
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
            row('Visible', metrics.visibleCount.toString()),
            row('Active', metrics.activeCount.toString()),
            row('With Market', metrics.withMarketCount.toString()),
            row('Under Desired', metrics.underDesiredCount.toString()),
            row('Under Max', metrics.underMaxCount.toString()),
          ],
        ),
      ),
    );
  }
}
