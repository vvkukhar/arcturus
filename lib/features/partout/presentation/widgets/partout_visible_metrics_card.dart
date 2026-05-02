// lib/features/partout/presentation/widgets/partout_visible_metrics_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/partout/application/partout_visible_metrics_provider.dart';

class PartOutVisibleMetricsCard extends StatelessWidget {
  final PartOutVisibleMetricsModel metrics;
  final String currency;

  const PartOutVisibleMetricsCard({
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
            row('Visible Projects', metrics.visibleCount.toString()),
            row(
              'Total Cost',
              CurrencyFormatter.format(metrics.totalCost, currency: currency),
            ),
            row(
              'Expected Value',
              CurrencyFormatter.format(metrics.totalExpected,
                  currency: currency),
            ),
            row(
              'Actual Value',
              CurrencyFormatter.format(metrics.totalActual, currency: currency),
            ),
            row(
              'Expected Profit',
              CurrencyFormatter.format(
                metrics.totalExpectedProfit,
                currency: currency,
              ),
            ),
            row(
              'Actual Profit',
              CurrencyFormatter.format(
                metrics.totalActualProfit,
                currency: currency,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
