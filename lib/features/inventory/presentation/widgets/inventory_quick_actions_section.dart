// lib/features/inventory/presentation/widgets/inventory_quick_actions_section.dart

import 'package:flutter/material.dart';

class InventoryQuickActionsSection extends StatelessWidget {
  final List<Widget> children;

  const InventoryQuickActionsSection({
    super.key,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 12),
        ...children,
      ],
    );
  }
}
