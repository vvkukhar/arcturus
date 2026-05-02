import 'package:flutter/material.dart';

class WatchlistOpportunityQuickBar extends StatelessWidget {
  final VoidCallback onQuickBuy;
  final VoidCallback onOpenWatchlist;

  const WatchlistOpportunityQuickBar({
    super.key,
    required this.onQuickBuy,
    required this.onOpenWatchlist,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: [
        FilledButton.icon(
          onPressed: onQuickBuy,
          icon: const Icon(Icons.shopping_bag_outlined),
          label: const Text('Quick Buy'),
        ),
        FilledButton.tonalIcon(
          onPressed: onOpenWatchlist,
          icon: const Icon(Icons.open_in_new),
          label: const Text('Open Watchlist'),
        ),
      ],
    );
  }
}