// lib/features/partout/presentation/widgets/partout_toolbar.dart

import 'package:flutter/material.dart';

class PartOutToolbar extends StatelessWidget {
  final VoidCallback onOpenFilters;
  final Widget sortDropdown;

  const PartOutToolbar({
    super.key,
    required this.onOpenFilters,
    required this.sortDropdown,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: sortDropdown),
        const SizedBox(width: 12),
        FilledButton.tonalIcon(
          onPressed: onOpenFilters,
          icon: const Icon(Icons.tune),
          label: const Text('Filters'),
        ),
      ],
    );
  }
}
