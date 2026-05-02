import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_sort_option.dart';

class PurchasesSortDropdown extends StatelessWidget {
  final PurchasesSortOption value;
  final ValueChanged<PurchasesSortOption?> onChanged;

  const PurchasesSortDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(PurchasesSortOption option) {
    switch (option) {
      case PurchasesSortOption.newest:
        return 'Newest';
      case PurchasesSortOption.oldest:
        return 'Oldest';
      case PurchasesSortOption.totalHighToLow:
        return 'Total High-Low';
      case PurchasesSortOption.totalLowToHigh:
        return 'Total Low-High';
      case PurchasesSortOption.sourceAsc:
        return 'Source A-Z';
    }
  }

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<PurchasesSortOption>(
      value: value,
      decoration: const InputDecoration(labelText: 'Sort'),
      items: PurchasesSortOption.values
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