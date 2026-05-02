import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class WatchlistBatchBuyService {
  const WatchlistBatchBuyService();

  double totalCost(List<WatchlistItemModel> items) {
    return items.fold(0, (sum, item) {
      final price = item.marketPrice ?? item.desiredBuyPrice;
      return sum + price;
    });
  }

  double totalEstimatedValue(List<WatchlistItemModel> items) {
    return items.fold(0, (sum, item) {
      return sum + item.maxBuyPrice;
    });
  }

  double totalSpread(List<WatchlistItemModel> items) {
    return totalEstimatedValue(items) - totalCost(items);
  }
}