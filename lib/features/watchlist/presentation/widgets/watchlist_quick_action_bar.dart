import 'package:flutter/material.dart';

class WatchlistQuickActionBar extends StatelessWidget {
  final VoidCallback onOpenDetails;
  final VoidCallback onCreatePurchase;
  final VoidCallback onSaveReport;

  const WatchlistQuickActionBar({
    super.key,
    required this.onOpenDetails,
    required this.onCreatePurchase,
    required this.onSaveReport,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: [
        FilledButton.tonalIcon(
          onPressed: onOpenDetails,
          icon: const Icon(Icons.open_in_new),
          label: const Text('Open'),
        ),
        FilledButton.tonalIcon(
          onPressed: onCreatePurchase,
          icon: const Icon(Icons.shopping_bag_outlined),
          label: const Text('Create Purchase'),
        ),
        FilledButton.tonalIcon(
          onPressed: onSaveReport,
          icon: const Icon(Icons.note_add_outlined),
          label: const Text('Save Report'),
        ),
      ],
    );
  }
}