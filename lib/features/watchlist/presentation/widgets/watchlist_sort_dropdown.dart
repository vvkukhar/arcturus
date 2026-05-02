import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';

class WatchlistSortDropdown extends StatelessWidget {
  final WatchlistSortOption value;
  final ValueChanged<WatchlistSortOption?> onChanged;

  const WatchlistSortDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(WatchlistSortOption option) {
    switch (option) {
      case WatchlistSortOption.newest:
        return 'Newest';
      case WatchlistSortOption.oldest:
        return 'Oldest';
      case WatchlistSortOption.titleAsc:
        return 'Title A-Z';
      case WatchlistSortOption.desiredLowToHigh:
        return 'Desired Low-High';
      case WatchlistSortOption.desiredHighToLow:
        return 'Desired High-Low';
      case WatchlistSortOption.marketLowToHigh:
        return 'Market Low-High';
      case WatchlistSortOption.marketHighToLow:
        return 'Market High-Low';
    }
  }

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<WatchlistSortOption>(
      value: value,
      decoration: const InputDecoration(labelText: 'Sort'),
      items: WatchlistSortOption.values
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