import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_cash_compare_model.dart';

class WatchlistAutoBuyCashCompareCard extends ConsumerWidget {
  final WatchlistAutoBuyCashCompareModel model;

  const WatchlistAutoBuyCashCompareCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = model.enoughCash ? Colors.green : Colors.orange;
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('${i18n.t('Spend')} ${model.totalSpend.toStringAsFixed(2)}')),
            Chip(label: Text('${i18n.t('Cash')} ${model.availableCash.toStringAsFixed(2)}')),
            Chip(
              label: Text('${i18n.t('Remaining')} ${model.remainingCash.toStringAsFixed(2)}'),
              backgroundColor: color.withValues(alpha: 0.15),
            ),
          ],
        ),
      ),
    );
  }
}