import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/item_lifecycle_step_model.dart';

class ItemLifecycleCard extends StatelessWidget {
  final List<ItemLifecycleStepModel> steps;

  const ItemLifecycleCard({
    super.key,
    required this.steps,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: steps
              .map(
                (step) => Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: step.active
                        ? Colors.green.withValues(alpha: 0.15)
                        : Colors.white10,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    step.label,
                    style: TextStyle(
                      color: step.active ? Colors.green : Colors.white70,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              )
              .toList(),
        ),
      ),
    );
  }
}