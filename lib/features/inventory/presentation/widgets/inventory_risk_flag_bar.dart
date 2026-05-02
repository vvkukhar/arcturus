import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_risk_flag_model.dart';

class InventoryRiskFlagBar extends StatelessWidget {
  final InventoryRiskFlagModel? model;

  const InventoryRiskFlagBar({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model == null) return const SizedBox.shrink();

    final chips = <Widget>[
      Chip(label: Text('Profit ${model!.expectedProfit.toStringAsFixed(2)}')),
      Chip(label: Text('Held ${model!.daysHeld}d')),
    ];

    if (model!.lowProfit) {
      chips.add(
        const Chip(
          label: Text('Low profit'),
          backgroundColor: Colors.orangeAccent,
        ),
      );
    }

    if (model!.highRisk) {
      chips.add(
        const Chip(
          label: Text('High risk'),
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