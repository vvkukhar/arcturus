class OpportunityCenterActionService {
  String description(String actionKey) {
    switch (actionKey) {
      case 'target_hits':
        return 'Focus on items already below desired price.';
      case 'under_max':
        return 'Review acceptable buys before prices change.';
      case 'open_watchlist':
        return 'Open the watchlist and decide the next buy.';
      default:
        return 'No action';
    }
  }
}
