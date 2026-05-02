// lib/features/market/presentation/widgets/market_toolbar.dart

import 'package:flutter/material.dart';

class MarketToolbar extends StatelessWidget {
  final VoidCallback onOpenFilters;
  final Widget sortDropdown;

  const MarketToolbar({
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
