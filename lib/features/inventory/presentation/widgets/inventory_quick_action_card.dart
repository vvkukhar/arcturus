// lib/features/inventory/presentation/widgets/inventory_quick_action_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_quick_action_model.dart';

class InventoryQuickActionCard extends StatelessWidget {
  final InventoryQuickActionModel action;
  final VoidCallback onTap;

  const InventoryQuickActionCard({
    super.key,
    required this.action,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                action.title,
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 15,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                action.subtitle,
                style: const TextStyle(color: Colors.white70),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
