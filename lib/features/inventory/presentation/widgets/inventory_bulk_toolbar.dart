// lib/features/inventory/presentation/widgets/inventory_bulk_toolbar.dart
import 'package:flutter/material.dart';

class InventoryBulkToolbar extends StatelessWidget {
  final int totalCount;
  final int selectedCount;
  final VoidCallback onSelectAll;
  final VoidCallback onClearSelection;

  const InventoryBulkToolbar({
    super.key,
    required this.totalCount,
    required this.selectedCount,
    required this.onSelectAll,
    required this.onClearSelection,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                'Selected $selectedCount of $totalCount',
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            TextButton(
              onPressed: onSelectAll,
              child: const Text('Select all'),
            ),
            TextButton(
              onPressed: onClearSelection,
              child: const Text('Clear'),
            ),
          ],
        ),
      ),
    );
  }
}
