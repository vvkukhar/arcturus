import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_visible_metrics_provider.dart';

class PurchasesVisibleMetricsCard extends StatelessWidget {
  final PurchasesVisibleMetricsModel metrics;
  final String currency;

  const PurchasesVisibleMetricsCard({
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
            row('Visible Purchases', metrics.visibleCount.toString()),
            row(
              'Total Spent',
              CurrencyFormatter.format(metrics.totalSpent, currency: currency),
            ),
            row(
              'Shipping',
              CurrencyFormatter.format(metrics.totalShipping, currency: currency),
            ),
            row(
              'Extra Costs',
              CurrencyFormatter.format(metrics.totalExtra, currency: currency),
            ),
            row(
              'Average Purchase',
              CurrencyFormatter.format(
                metrics.averagePurchase,
                currency: currency,
              ),
            ),
          ],
        ),
      ),
    );
  }
}