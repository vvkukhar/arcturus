import 'package:flutter/material.dart';

class InventoryArchiveQuickChips extends StatelessWidget {
  final bool showArchived;
  final int archivedCount;
  final ValueChanged<bool> onChanged;

  const InventoryArchiveQuickChips({
    super.key,
    required this.showArchived,
    required this.archivedCount,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        FilterChip(
          label: const Text('Active only'),
          selected: !showArchived,
          onSelected: (_) => onChanged(false),
        ),
        FilterChip(
          label: Text('With archived ($archivedCount)'),
          selected: showArchived,
          onSelected: (_) => onChanged(true),
        ),
      ],
    );
  }
}