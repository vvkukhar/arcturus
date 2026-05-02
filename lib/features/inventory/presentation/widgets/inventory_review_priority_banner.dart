import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_priority_model.dart';

class InventoryReviewPriorityBanner extends StatelessWidget {
  final InventoryReviewPriorityModel model;

  const InventoryReviewPriorityBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final urgent = model.severeAlerts >= 5 || model.highRiskItems >= 5;
    final color = urgent ? Colors.redAccent : Colors.orange;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '${model.label} • severe ${model.severeAlerts} • risk ${model.highRiskItems}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}