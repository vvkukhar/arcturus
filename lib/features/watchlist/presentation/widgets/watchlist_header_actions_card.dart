import 'package:flutter/material.dart';

class WatchlistHeaderActionsCard extends StatelessWidget {
  final VoidCallback onOpenFilters;
  final VoidCallback onOpenOpportunityCenter;
  final VoidCallback onAddItem;

  const WatchlistHeaderActionsCard({
    super.key,
    required this.onOpenFilters,
    required this.onOpenOpportunityCenter,
    required this.onAddItem,
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
              onPressed: onOpenFilters,
              icon: const Icon(Icons.tune),
              label: const Text('Filters'),
            ),
            FilledButton.tonalIcon(
              onPressed: onOpenOpportunityCenter,
              icon: const Icon(Icons.tips_and_updates_outlined),
              label: const Text('Opportunities'),
            ),
            FilledButton.icon(
              onPressed: onAddItem,
              icon: const Icon(Icons.add),
              label: const Text('Add'),
            ),
          ],
        ),
      ),
    );
  }
}