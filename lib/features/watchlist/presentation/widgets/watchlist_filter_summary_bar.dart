import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_filter_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_sort_option.dart';

class WatchlistFilterSummaryBar extends StatelessWidget {
  final int visibleCount;
  final int totalCount;
  final WatchlistFilterModel filter;
  final WatchlistSortOption sort;
  final VoidCallback onClearFilters;

  const WatchlistFilterSummaryBar({
    super.key,
    required this.visibleCount,
    required this.totalCount,
    required this.filter,
    required this.sort,
    required this.onClearFilters,
  });

  String _sortLabel() {
    switch (sort) {
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
    return Row(
      children: [
        Expanded(
          child: Text(
            'Visible: $visibleCount / Total: $totalCount • ${_sortLabel()}',
            style: const TextStyle(
              color: Colors.white70,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        if (filter.hasAnyFilter)
          TextButton(
            onPressed: onClearFilters,
            child: const Text('Clear filters'),
          ),
      ],
    );
  }
}