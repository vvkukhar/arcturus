import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/sales/application/sales_metrics_provider.dart';

class SalesSummaryCard extends StatelessWidget {
  final SalesMetricsModel metrics;
  final String currency;

  const SalesSummaryCard({
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
            row('Total Sales', metrics.totalCount.toString()),
            row(
              'Revenue',
              CurrencyFormatter.format(metrics.visibleRevenue, currency: currency),
            ),
            row(
              'Fees',
              CurrencyFormatter.format(metrics.totalFees, currency: currency),
            ),
            row(
              'Net',
              CurrencyFormatter.format(metrics.totalNet, currency: currency),
            ),
          ],
        ),
      ),
    );
  }
}