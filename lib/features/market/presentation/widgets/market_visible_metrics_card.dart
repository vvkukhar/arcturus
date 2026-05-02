// lib/features/market/presentation/widgets/market_visible_metrics_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/market/application/market_visible_metrics_provider.dart';

class MarketVisibleMetricsCard extends StatelessWidget {
  final MarketVisibleMetricsModel metrics;
  final String currency;

  const MarketVisibleMetricsCard({
    super.key,
    required this.metrics,
    required this.currency,
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
            row('Visible Snapshots', metrics.visibleCount.toString()),
            row(
              'Avg Low',
              CurrencyFormatter.format(metrics.averageLow, currency: currency),
            ),
            row(
              'Avg Mid',
              CurrencyFormatter.format(metrics.averageMid, currency: currency),
            ),
            row(
              'Avg High',
              CurrencyFormatter.format(metrics.averageHigh, currency: currency),
            ),
            row('With URL', metrics.withUrlCount.toString()),
          ],
        ),
      ),
    );
  }
}
