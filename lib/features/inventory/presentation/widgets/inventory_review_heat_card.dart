import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_heat_model.dart';

class InventoryReviewHeatCard extends StatelessWidget {
  final InventoryReviewHeatModel model;

  const InventoryReviewHeatCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = model.heatScore >= 25
        ? Colors.redAccent
        : model.heatScore >= 12
            ? Colors.orange
            : model.heatScore > 0
                ? Colors.blue
                : Colors.green;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                model.label,
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            Text(
              model.heatScore.toStringAsFixed(1),
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
