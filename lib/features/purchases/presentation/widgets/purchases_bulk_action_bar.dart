import 'package:flutter/material.dart';

class PurchasesBulkActionBar extends StatelessWidget {
  final int selectedCount;
  final VoidCallback onDeleteSelected;
  final VoidCallback onClear;

  const PurchasesBulkActionBar({
    super.key,
    required this.selectedCount,
    required this.onDeleteSelected,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedCount == 0) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                'Selected: $selectedCount',
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            TextButton(
              onPressed: onClear,
              child: const Text('Clear'),
            ),
            const SizedBox(width: 8),
            FilledButton.tonalIcon(
              onPressed: onDeleteSelected,
              icon: const Icon(Icons.delete_outline),
              label: const Text('Delete'),
            ),
          ],
        ),
      ),
    );
  }
}