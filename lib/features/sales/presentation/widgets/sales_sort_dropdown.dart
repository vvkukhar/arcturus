import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/sales/application/sales_sort_option.dart';

class SalesSortDropdown extends StatelessWidget {
  final SalesSortOption value;
  final ValueChanged<SalesSortOption?> onChanged;

  const SalesSortDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(SalesSortOption option) {
    switch (option) {
      case SalesSortOption.newest:
        return 'Newest';
      case SalesSortOption.oldest:
        return 'Oldest';
      case SalesSortOption.finalNetHighToLow:
        return 'Net High-Low';
      case SalesSortOption.finalNetLowToHigh:
        return 'Net Low-High';
      case SalesSortOption.platformAsc:
        return 'Platform A-Z';
    }
  }

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<SalesSortOption>(
      value: value,
      decoration: const InputDecoration(labelText: 'Sort'),
      items: SalesSortOption.values
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