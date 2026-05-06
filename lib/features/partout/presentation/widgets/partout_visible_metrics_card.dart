import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/partout/application/partout_visible_metrics_provider.dart';

class PartOutVisibleMetricsCard extends ConsumerWidget {
  final PartOutVisibleMetricsModel metrics;
  final String currency;

  const PartOutVisibleMetricsCard({
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
            Expanded(child: Text(i18n.t(label))),
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
              'inv.totalCost',
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
              'inv.expectedProfit',
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