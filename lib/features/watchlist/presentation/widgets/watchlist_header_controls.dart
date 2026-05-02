import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_search_field.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_sort_dropdown.dart';

class WatchlistHeaderControls extends StatelessWidget {
  final TextEditingController searchController;
  final WatchlistSortOption sort;
  final int visibleCount;
  final int totalCount;
  final ValueChanged<String> onSearchChanged;
  final VoidCallback onSearchClear;
  final ValueChanged<WatchlistSortOption?> onSortChanged;

  const WatchlistHeaderControls({
    super.key,
    required this.searchController,
    required this.sort,
    required this.visibleCount,
    required this.totalCount,
    required this.onSearchChanged,
    required this.onSearchClear,
    required this.onSortChanged,
  });

  String _sortLabel(WatchlistSortOption option) {
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
    return Column(
      children: [
        WatchlistSearchField(
          controller: searchController,
          onChanged: onSearchChanged,
          onClear: onSearchClear,
        ),
        const SizedBox(height: 12),
        WatchlistSortDropdown(
          value: sort,
          onChanged: onSortChanged,
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: Text(
                'Visible: $visibleCount / Total: $totalCount',
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  color: Colors.white70,
                ),
              ),
            ),
            Text(
              'Sort: ${_sortLabel(sort)}',
              style: const TextStyle(
                color: Colors.white60,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ],
    );
  }
}