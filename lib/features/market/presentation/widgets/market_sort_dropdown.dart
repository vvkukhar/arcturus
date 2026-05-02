// lib/features/market/presentation/widgets/market_sort_dropdown.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/market/application/market_sort_option.dart';

class MarketSortDropdown extends StatelessWidget {
  final MarketSortOption value;
  final ValueChanged<MarketSortOption?> onChanged;

  const MarketSortDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(MarketSortOption option) {
    switch (option) {
      case MarketSortOption.newest:
        return 'Newest';
      case MarketSortOption.oldest:
        return 'Oldest';
      case MarketSortOption.averageHighToLow:
        return 'Average High-Low';
      case MarketSortOption.lowHighToLow:
        return 'Low High-Low';
      case MarketSortOption.highHighToLow:
        return 'High High-Low';
      case MarketSortOption.sourceAsc:
        return 'Source A-Z';
    }
  }

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<MarketSortOption>(
      value: value,
      decoration: const InputDecoration(labelText: 'Sort'),
      items: MarketSortOption.values
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
