import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_confidence_provider.dart';

class InventoryExecutionConfidenceCard extends StatelessWidget {
  final InventoryExecutionConfidenceModel model;

  const InventoryExecutionConfidenceCard({
    super.key,
    required this.model,
  });

  Color _color() {
    if (model.score >= 75) return Colors.green;
    if (model.score >= 50) return Colors.orange;
    return Colors.redAccent;
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                model.label,
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                model.score.toStringAsFixed(0),
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
