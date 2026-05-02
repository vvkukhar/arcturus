import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_filter_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';

class InventoryActiveFilterChips extends StatelessWidget {
  final InventoryFilterModel filter;
  final InventorySortOption sort;
  final VoidCallback onClearAll;

  const InventoryActiveFilterChips({
    super.key,
    required this.filter,
    required this.sort,
    required this.onClearAll,
  });

  String _sortLabel() {
    switch (sort) {
      case InventorySortOption.newest:
        return 'Newest';
      case InventorySortOption.oldest:
        return 'Oldest';
      case InventorySortOption.titleAsc:
        return 'Title A-Z';
      case InventorySortOption.costHighToLow:
        return 'Cost High-Low';
      case InventorySortOption.costLowToHigh:
        return 'Cost Low-High';
      case InventorySortOption.expectedProfitHighToLow:
        return 'Profit High-Low';
      case InventorySortOption.daysInInventoryHighToLow:
        return 'Oldest Held';
    }
  }

  @override
  Widget build(BuildContext context) {
    final chips = <Widget>[
      Chip(label: Text('Sort: ${_sortLabel()}')),
    ];

    if (filter.status != null) {
      chips.add(Chip(label: Text('Status: ${filter.status!.name}')));
    }
    if (filter.trackedOnly) {
      chips.add(const Chip(label: Text('Tracked only')));
    }
    if ((filter.themeContains ?? '').trim().isNotEmpty) {
      chips.add(Chip(label: Text('Theme: ${filter.themeContains}')));
    }

    final hasExtraFilters = filter.status != null ||
        filter.trackedOnly ||
        (filter.themeContains ?? '').trim().isNotEmpty;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: chips,
            ),
            if (hasExtraFilters) ...[
              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: onClearAll,
                  child: const Text('Clear filters'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
