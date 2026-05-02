// lib/features/watchlist/application/watchlist_convert_payload.dart

import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class WatchlistConvertPayload {
  final WatchlistItemModel watchlistItem;
  final ItemModel inventoryItem;

  const WatchlistConvertPayload({
    required this.watchlistItem,
    required this.inventoryItem,
  });
}
