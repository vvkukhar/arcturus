import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_deep_metrics_model.dart';

class DashboardMetricsCard extends StatelessWidget {
  final DashboardDeepMetricsModel metrics;
  final String currency;

  const DashboardMetricsCard({
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
            row('Alerts', metrics.alertsCount.toString()),
            row('Stale Items', metrics.staleCount.toString()),
            row('Best Deals', metrics.bestDealsCount.toString()),
            row('Sold Count', metrics.totalSoldCount.toString()),
            row('Active Count', metrics.totalActiveCount.toString()),
            row(
              'Top Expected Profit',
              CurrencyFormatter.format(
                metrics.topExpectedProfit,
                currency: currency,
              ),
            ),
          ],
        ),
      ),
    );
  }
}