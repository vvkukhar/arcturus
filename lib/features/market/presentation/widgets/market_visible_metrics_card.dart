import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/core/utils/currency_formatter.dart';
import 'package:lego_trading_manager/features/market/application/market_visible_metrics_provider.dart';

class MarketVisibleMetricsCard extends ConsumerWidget {
  final MarketVisibleMetricsModel metrics;
  final String currency;

  const MarketVisibleMetricsCard({
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
            row(i18n.t('Visible Snapshots'), metrics.visibleCount.toString()),
            row(
              i18n.t('Avg Low'),
              CurrencyFormatter.format(metrics.averageLow, currency: currency),
            ),
            row(
              i18n.t('Avg Mid'),
              CurrencyFormatter.format(metrics.averageMid, currency: currency),
            ),
            row(
              i18n.t('Avg High'),
              CurrencyFormatter.format(metrics.averageHigh, currency: currency),
            ),
            row(i18n.t('With URL'), metrics.withUrlCount.toString()),
          ],
        ),
      ),
    );
  }
}