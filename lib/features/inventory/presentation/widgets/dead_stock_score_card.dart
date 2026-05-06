import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_score_model.dart';

class DeadStockScoreCard extends ConsumerWidget {
  final DeadStockScoreModel model;

  const DeadStockScoreCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: ListTile(
        title: Text(model.title),
        subtitle: Text(
          '${i18n.t('Days')}: ${model.days} | ${i18n.t('Capital')}: ${model.capital.toStringAsFixed(0)} | '
          '${i18n.t('Expected')}: ${model.expectedProfit.toStringAsFixed(0)}',
        ),
        trailing: Text(
          model.score.toStringAsFixed(1),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}