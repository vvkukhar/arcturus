import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_pressure_model.dart';

class InventoryExecutionPressureBanner extends StatelessWidget {
  final InventoryExecutionPressureModel model;

  const InventoryExecutionPressureBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = model.score >= 25
        ? Colors.redAccent
        : model.score >= 15
            ? Colors.orange
            : Colors.green;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${model.label} • ${model.score.toStringAsFixed(1)}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}