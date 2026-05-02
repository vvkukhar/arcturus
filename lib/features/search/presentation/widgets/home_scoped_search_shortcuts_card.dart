import 'package:flutter/material.dart';

class HomeScopedSearchShortcutsCard extends StatelessWidget {
  final void Function(String scope) onOpenScope;

  const HomeScopedSearchShortcutsCard({
    super.key,
    required this.onOpenScope,
  });

  @override
  Widget build(BuildContext context) {
    const scopes = [
      ('inventory', 'Inventory'),
      ('watchlist', 'Watchlist'),
      ('purchase', 'Purchases'),
      ('sale', 'Sales'),
      ('market', 'Market'),
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: scopes.map((item) {
            return ActionChip(
              label: Text(item.$2),
              onPressed: () => onOpenScope(item.$1),
            );
          }).toList(),
        ),
      ),
    );
  }
}