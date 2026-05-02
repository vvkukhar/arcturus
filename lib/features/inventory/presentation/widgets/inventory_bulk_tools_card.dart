import 'package:flutter/material.dart';

class InventoryBulkToolsCard extends StatelessWidget {
  final int selectedCount;
  final VoidCallback onOpenReprice;
  final VoidCallback onSelectAllVisible;
  final VoidCallback onClearSelection;

  const InventoryBulkToolsCard({
    super.key,
    required this.selectedCount,
    required this.onOpenReprice,
    required this.onSelectAllVisible,
    required this.onClearSelection,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedCount == 0) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton.tonalIcon(
              onPressed: onOpenReprice,
              icon: const Icon(Icons.sell_outlined),
              label: const Text('Bulk Reprice'),
            ),
            FilledButton.tonalIcon(
              onPressed: onSelectAllVisible,
              icon: const Icon(Icons.select_all),
              label: const Text('Select Visible'),
            ),
            FilledButton.tonalIcon(
              onPressed: onClearSelection,
              icon: const Icon(Icons.clear_all),
              label: const Text('Clear Selection'),
            ),
          ],
        ),
      ),
    );
  }
}