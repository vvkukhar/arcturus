import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_risk_flag_model.dart';

class InventoryRiskFlagBar extends ConsumerWidget {
  final InventoryRiskFlagModel? model;

  const InventoryRiskFlagBar({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (model == null) return const SizedBox.shrink();

    final i18n = ref.watch(i18nProvider.notifier);

    final chips = <Widget>[
      Chip(label: Text('${i18n.t('Profit')} ${model!.expectedProfit.toStringAsFixed(2)}')),
      Chip(label: Text('${i18n.t('Held')} ${model!.daysHeld}d')),
    ];

    if (model!.lowProfit) {
      chips.add(
        Chip(
          label: Text(i18n.t('Low profit')),
          backgroundColor: Colors.orangeAccent,
        ),
      );
    }

    if (model!.highRisk) {
      chips.add(
        Chip(
          label: Text(i18n.t('High risk')),
          backgroundColor: Colors.redAccent,
        ),
      );
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: chips,
    );
  }
}