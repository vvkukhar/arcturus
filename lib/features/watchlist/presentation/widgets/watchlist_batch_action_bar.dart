import 'package:flutter/material.dart';

class WatchlistBatchActionBar extends StatelessWidget {
  final int selectedCount;
  final VoidCallback onClear;
  final VoidCallback onBuy;

  const WatchlistBatchActionBar({
    super.key,
    required this.selectedCount,
    required this.onClear,
    required this.onBuy,
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
            FilledButton(
              onPressed: onBuy,
              child: const Text('Buy All'),
            ),
          ],
        ),
      ),
    );
  }
}