import 'package:flutter/material.dart';

class WatchlistReviewQueueActionBar extends StatelessWidget {
  final int count;
  final VoidCallback onOpenWatchlist;
  final VoidCallback onOpenOpportunities;

  const WatchlistReviewQueueActionBar({
    super.key,
    required this.count,
    required this.onOpenWatchlist,
    required this.onOpenOpportunities,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        Chip(label: Text('Queue: $count')),
        FilledButton.tonalIcon(
          onPressed: onOpenWatchlist,
          icon: const Icon(Icons.bookmark_outline),
          label: const Text('Watchlist'),
        ),
        FilledButton.tonalIcon(
          onPressed: onOpenOpportunities,
          icon: const Icon(Icons.tips_and_updates_outlined),
          label: const Text('Opportunities'),
        ),
      ],
    );
  }
}