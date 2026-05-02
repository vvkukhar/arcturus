import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';

class InventorySortDropdown extends StatelessWidget {
  final InventorySortOption value;
  final ValueChanged<InventorySortOption?> onChanged;

  const InventorySortDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(InventorySortOption option) {
    switch (option) {
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
    return DropdownButtonFormField<InventorySortOption>(
      value: value,
      decoration: const InputDecoration(labelText: 'Sort'),
      items: InventorySortOption.values
          .map(
            (option) => DropdownMenuItem(
              value: option,
              child: Text(_label(option)),
            ),
          )
          .toList(),
      onChanged: onChanged,
    );
  }
}
