import 'package:flutter/material.dart';

class WatchlistPriorityActionBar extends StatelessWidget {
  final VoidCallback onOpenWatchlist;
  final VoidCallback onOpenOpportunities;

  const WatchlistPriorityActionBar({
    super.key,
    required this.onOpenWatchlist,
    required this.onOpenOpportunities,
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
              onPressed: onOpenWatchlist,
              icon: const Icon(Icons.bookmark_outline),
              label: const Text('Open Watchlist'),
            ),
            FilledButton.tonalIcon(
              onPressed: onOpenOpportunities,
              icon: const Icon(Icons.tips_and_updates_outlined),
              label: const Text('Open Opportunities'),
            ),
          ],
        ),
      ),
    );
  }
}