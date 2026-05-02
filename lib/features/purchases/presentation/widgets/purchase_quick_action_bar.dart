import 'package:flutter/material.dart';

class PurchaseQuickActionBar extends StatelessWidget {
  final VoidCallback onOpenDetails;
  final VoidCallback onDuplicate;
  final VoidCallback onSaveReport;

  const PurchaseQuickActionBar({
    super.key,
    required this.onOpenDetails,
    required this.onDuplicate,
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
          onPressed: onDuplicate,
          icon: const Icon(Icons.copy_outlined),
          label: const Text('Duplicate'),
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