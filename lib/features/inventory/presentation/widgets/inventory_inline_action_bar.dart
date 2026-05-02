import 'package:flutter/material.dart';

class InventoryInlineActionBar extends StatelessWidget {
  final VoidCallback? onMarkListed;
  final VoidCallback? onMarkSold;
  final VoidCallback? onArchive;

  const InventoryInlineActionBar({
    super.key,
    this.onMarkListed,
    this.onMarkSold,
    this.onArchive,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        FilledButton.tonalIcon(
          onPressed: onMarkListed,
          icon: const Icon(Icons.sell_outlined),
          label: const Text('List'),
        ),
        FilledButton.tonalIcon(
          onPressed: onMarkSold,
          icon: const Icon(Icons.check_circle_outline),
          label: const Text('Sold'),
        ),
        FilledButton.tonalIcon(
          onPressed: onArchive,
          icon: const Icon(Icons.archive_outlined),
          label: const Text('Archive'),
        ),
      ],
    );
  }
}
