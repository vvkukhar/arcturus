class InventoryActionCenterActionService {
  String description(String actionKey) {
    switch (actionKey) {
      case 'dead_stock':
        return 'Open aging inventory and reprice it.';
      case 'opportunities':
        return 'Open live buy opportunities from watchlist.';
      case 'profit_first':
        return 'Sort inventory by expected profit descending.';
      case 'oldest_first':
        return 'Sort inventory by oldest holding period first.';
      default:
        return 'No action';
    }
  }
}
