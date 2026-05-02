// lib/features/partout/presentation/widgets/partout_sort_dropdown.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/partout/application/partout_sort_option.dart';

class PartOutSortDropdown extends StatelessWidget {
  final PartOutSortOption value;
  final ValueChanged<PartOutSortOption?> onChanged;

  const PartOutSortDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(PartOutSortOption option) {
    switch (option) {
      case PartOutSortOption.newest:
        return 'Newest';
      case PartOutSortOption.oldest:
        return 'Oldest';
      case PartOutSortOption.titleAsc:
        return 'Title A-Z';
      case PartOutSortOption.titleDesc:
        return 'Title Z-A';
      case PartOutSortOption.costHighToLow:
        return 'Cost High-Low';
      case PartOutSortOption.expectedHighToLow:
        return 'Expected High-Low';
      case PartOutSortOption.actualHighToLow:
        return 'Actual High-Low';
      case PartOutSortOption.profitExpectedHighToLow:
        return 'Expected Profit';
      case PartOutSortOption.profitActualHighToLow:
        return 'Actual Profit';
    }
  }

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<PartOutSortOption>(
      value: value,
      decoration: const InputDecoration(labelText: 'Sort'),
      items: PartOutSortOption.values
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
