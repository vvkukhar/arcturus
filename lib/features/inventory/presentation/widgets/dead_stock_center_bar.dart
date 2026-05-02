// lib/features/inventory/presentation/widgets/dead_stock_center_bar.dart
import 'package:flutter/material.dart';

class DeadStockCenterBar extends StatelessWidget {
  final VoidCallback onOpenInventory;
  final VoidCallback onSaveReport;

  const DeadStockCenterBar({
    super.key,
    required this.onOpenInventory,
    required this.onSaveReport,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton.tonalIcon(
              onPressed: onOpenInventory,
              icon: const Icon(Icons.inventory_outlined),
              label: const Text('Open Inventory'),
            ),
            FilledButton.tonalIcon(
              onPressed: onSaveReport,
              icon: const Icon(Icons.note_add_outlined),
              label: const Text('Save Report'),
            ),
          ],
        ),
      ),
    );
  }
}
