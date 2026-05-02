import 'package:flutter/material.dart';

class InventoryBulkReserveBar extends StatelessWidget {
  final int selectedCount;
  final VoidCallback onReserve;
  final VoidCallback onUnreserve;

  const InventoryBulkReserveBar({
    super.key,
    required this.selectedCount,
    required this.onReserve,
    required this.onUnreserve,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedCount == 0) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            FilledButton.tonalIcon(
              onPressed: onReserve,
              icon: const Icon(Icons.lock_outline),
              label: const Text('Reserve Selected'),
            ),
            FilledButton.tonalIcon(
              onPressed: onUnreserve,
              icon: const Icon(Icons.lock_open_outlined),
              label: const Text('Unreserve Selected'),
            ),
          ],
        ),
      ),
    );
  }
}
