import 'package:flutter/material.dart';

class WatchlistReviewQueueBatchBar extends StatelessWidget {
  final int selectedCount;
  final VoidCallback onBuySelected;
  final VoidCallback onClear;

  const WatchlistReviewQueueBatchBar({
    super.key,
    required this.selectedCount,
    required this.onBuySelected,
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
                'Selected queue items: $selectedCount',
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            TextButton(
              onPressed: onClear,
              child: const Text('Clear'),
            ),
            const SizedBox(width: 8),
            FilledButton.icon(
              onPressed: onBuySelected,
              icon: const Icon(Icons.shopping_bag_outlined),
              label: const Text('Buy Selected'),
            ),
          ],
        ),
      ),
    );
  }
}