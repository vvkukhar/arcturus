import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class WatchlistQuickPurchasePayload {
  final WatchlistItemModel watchlistItem;
  final ItemModel inventoryItem;

  const WatchlistQuickPurchasePayload({
    required this.watchlistItem,
    required this.inventoryItem,
  });
}
