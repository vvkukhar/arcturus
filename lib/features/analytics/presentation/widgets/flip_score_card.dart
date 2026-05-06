import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_model.dart';

class FlipScoreCard extends ConsumerWidget {
  final FlipScoreModel model;

  const FlipScoreCard({
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
          '${i18n.t('inv.expectedProfit')}: ${model.expectedProfit.toStringAsFixed(2)} | '
          '${i18n.t('Days')}: ${model.daysInInventory}',
        ),
        trailing: Text(
          model.score.toStringAsFixed(1),
          style: const TextStyle(
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}