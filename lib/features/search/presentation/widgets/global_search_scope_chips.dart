import 'package:flutter/material.dart';

class GlobalSearchScopeChips extends StatelessWidget {
  final String? selected;
  final ValueChanged<String?> onSelected;

  const GlobalSearchScopeChips({
    super.key,
    required this.selected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    const scopes = <String?>[
      null,
      'inventory',
      'watchlist',
      'purchase',
      'sale',
      'market',
    ];

    String label(String? value) {
      switch (value) {
        case null:
          return 'All';
        case 'inventory':
          return 'Inventory';
        case 'watchlist':
          return 'Watchlist';
        case 'purchase':
          return 'Purchases';
        case 'sale':
          return 'Sales';
        case 'market':
          return 'Market';
        default:
          return value;
      }
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: scopes.map((scope) {
        final active = selected == scope;
        return ChoiceChip(
          label: Text(label(scope)),
          selected: active,
          onSelected: (_) => onSelected(scope),
        );
      }).toList(),
    );
  }
}