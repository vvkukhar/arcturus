import 'package:flutter/material.dart';

class WatchlistEmptyState extends StatelessWidget {
  final VoidCallback onAdd;

  const WatchlistEmptyState({
    super.key,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.bookmark_add_outlined,
                size: 42,
              ),
              const SizedBox(height: 12),
              const Text(
                'Watchlist is empty',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Add target LEGO items here and track buy thresholds.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: onAdd,
                icon: const Icon(Icons.add),
                label: const Text('Add Watchlist Item'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}