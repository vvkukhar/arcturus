import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_metrics_provider.dart';

class InventoryMetricsCard extends ConsumerWidget {
  final InventoryMetricsModel metrics;
  final String currency;

  const InventoryMetricsCard({
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
            row(i18n.t('Visible'), metrics.visibleCount.toString()),
            row(i18n.t('Sold'), metrics.soldCount.toString()),
            row(i18n.t('Active'), metrics.activeCount.toString()),
            row(
              i18n.t('Total Cost'),
              CurrencyFormatter.format(metrics.totalCost, currency: currency),
            ),
            row(
              i18n.t('Market Value'),
              CurrencyFormatter.format(metrics.totalMarketValue,
                  currency: currency),
            ),
            row(
              i18n.t('Expected Profit'),
              CurrencyFormatter.format(metrics.totalExpectedProfit,
                  currency: currency),
            ),
          ],
        ),
      ),
    );
  }
}