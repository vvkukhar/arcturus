import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_trend_deep_model.dart';

class MarketTrendDeepCard extends ConsumerWidget {
  final MarketTrendDeepModel model;

  const MarketTrendDeepCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              model.itemTitle,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 8,
              children: [
                Text('${i18n.t('inv.marketLow')}: ${model.low.toStringAsFixed(2)}'),
                Text('${i18n.t('inv.marketAvg')}: ${model.average.toStringAsFixed(2)}'),
                Text('${i18n.t('High Price')}: ${model.high.toStringAsFixed(2)}'),
                Text('${i18n.t('Spread')}: ${model.spread.toStringAsFixed(2)}'),
                Text('${i18n.t('Snapshots')}: ${model.snapshots}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}