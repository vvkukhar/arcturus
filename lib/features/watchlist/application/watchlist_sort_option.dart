enum WatchlistSortOption {
  newest,
  oldest,
  titleAsc,
  desiredLowToHigh,
  desiredHighToLow,
  marketLowToHigh,
  marketHighToLow,
}

extension WatchlistSortOptionLabel on WatchlistSortOption {
  String get label {
    switch (this) {
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
}