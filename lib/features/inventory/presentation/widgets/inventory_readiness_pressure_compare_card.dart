import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_readiness_pressure_compare_model.dart';

class InventoryReadinessPressureCompareCard extends StatelessWidget {
  final InventoryReadinessPressureCompareModel model;

  const InventoryReadinessPressureCompareCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final positive = model.readiness >= model.pressure;
    final color = positive ? Colors.green : Colors.redAccent;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              model.label,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Readiness ${model.readiness.toStringAsFixed(0)} • Pressure ${model.pressure.toStringAsFixed(0)}',
              style: TextStyle(color: color),
            ),
          ],
        ),
      ),
    );
  }
}