import 'package:flutter/material.dart';

class WatchlistOpportunityActionBar extends StatelessWidget {
  final VoidCallback onOpenWatchlist;
  final VoidCallback onSaveReport;

  const WatchlistOpportunityActionBar({
    super.key,
    required this.onOpenWatchlist,
    required this.onSaveReport,
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
              onPressed: onSaveReport,
              icon: const Icon(Icons.note_add_outlined),
              label: const Text('Save Report'),
            ),
          ],
        ),
      ),
    );
  }
}