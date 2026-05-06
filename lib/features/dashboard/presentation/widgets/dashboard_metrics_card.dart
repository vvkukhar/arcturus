import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_deep_metrics_model.dart';

class DashboardMetricsCard extends ConsumerWidget {
  final DashboardDeepMetricsModel metrics;
  final String currency;

  const DashboardMetricsCard({
    super.key,
    required this.metrics,
    required this.currency,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
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
            row(i18n.t('Alerts'), metrics.alertsCount.toString()),
            row(i18n.t('Stale Items'), metrics.staleCount.toString()),
            row(i18n.t('Best Deals'), metrics.bestDealsCount.toString()),
            row(i18n.t('Sold Count'), metrics.totalSoldCount.toString()),
            row(i18n.t('Active Count'), metrics.totalActiveCount.toString()),
            row(
              i18n.t('Top Expected Profit'),
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