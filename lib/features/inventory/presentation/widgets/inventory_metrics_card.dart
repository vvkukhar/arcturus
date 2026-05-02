import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_metrics_provider.dart';

class InventoryMetricsCard extends StatelessWidget {
  final InventoryMetricsModel metrics;
  final String currency;

  const InventoryMetricsCard({
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
            row('Visible', metrics.visibleCount.toString()),
            row('Sold', metrics.soldCount.toString()),
            row('Active', metrics.activeCount.toString()),
            row(
              'Total Cost',
              CurrencyFormatter.format(metrics.totalCost, currency: currency),
            ),
            row(
              'Market Value',
              CurrencyFormatter.format(metrics.totalMarketValue,
                  currency: currency),
            ),
            row(
              'Expected Profit',
              CurrencyFormatter.format(metrics.totalExpectedProfit,
                  currency: currency),
            ),
          ],
        ),
      ),
    );
  }
}
