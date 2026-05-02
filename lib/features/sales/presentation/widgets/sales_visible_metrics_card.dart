import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/sales/application/sales_visible_metrics_provider.dart';

class SalesVisibleMetricsCard extends StatelessWidget {
  final SalesVisibleMetricsModel metrics;
  final String currency;

  const SalesVisibleMetricsCard({
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
            row('Visible Sales', metrics.visibleCount.toString()),
            row(
              'Revenue',
              CurrencyFormatter.format(metrics.revenue, currency: currency),
            ),
            row(
              'Fees',
              CurrencyFormatter.format(metrics.fees, currency: currency),
            ),
            row(
              'Net',
              CurrencyFormatter.format(metrics.net, currency: currency),
            ),
            row('Profitable', metrics.profitableCount.toString()),
          ],
        ),
      ),
    );
  }
}