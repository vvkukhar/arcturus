import 'package:flutter/material.dart';

class WatchlistBulkActionBar extends StatelessWidget {
  final int selectedCount;
  final VoidCallback onActivate;
  final VoidCallback onDeactivate;
  final VoidCallback onDelete;
  final VoidCallback onClear;

  const WatchlistBulkActionBar({
    super.key,
    required this.selectedCount,
    required this.onActivate,
    required this.onDeactivate,
    required this.onDelete,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedCount == 0) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Selected: $selectedCount',
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                TextButton(
                  onPressed: onClear,
                  child: const Text('Clear'),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                FilledButton.tonalIcon(
                  onPressed: onActivate,
                  icon: const Icon(Icons.check_circle_outline),
                  label: const Text('Activate'),
                ),
                FilledButton.tonalIcon(
                  onPressed: onDeactivate,
                  icon: const Icon(Icons.pause_circle_outline),
                  label: const Text('Deactivate'),
                ),
                FilledButton.tonalIcon(
                  onPressed: onDelete,
                  icon: const Icon(Icons.delete_outline),
                  label: const Text('Delete'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}