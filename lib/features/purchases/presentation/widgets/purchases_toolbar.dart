import 'package:flutter/material.dart';

class PurchasesToolbar extends StatelessWidget {
  final Widget sortDropdown;
  final VoidCallback onOpenFilters;
  final VoidCallback onClearFilters;

  const PurchasesToolbar({
    super.key,
    required this.sortDropdown,
    required this.onOpenFilters,
    required this.onClearFilters,
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
        const SizedBox(width: 8),
        IconButton(
          onPressed: onClearFilters,
          icon: const Icon(Icons.clear_all),
        ),
      ],
    );
  }
}