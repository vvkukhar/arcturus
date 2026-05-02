import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_readiness_model.dart';

class InventoryActionReadinessBanner extends StatelessWidget {
  final InventoryActionReadinessModel model;

  const InventoryActionReadinessBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = model.score >= 65
        ? Colors.green
        : model.score >= 40
            ? Colors.orange
            : Colors.redAccent;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${model.label} • ${model.score.toStringAsFixed(0)}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}