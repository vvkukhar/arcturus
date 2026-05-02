import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_draft_model.dart';

class WatchlistToPurchaseDraftService {
  WatchlistPurchaseDraftModel build(WatchlistItemModel item) {
    final buyPrice = item.marketPrice ?? item.desiredBuyPrice;

    return WatchlistPurchaseDraftModel(
      title: item.title,
      refId: item.refId,
      theme: item.theme,
      quantity: 1,
      buyPrice: buyPrice,
      estimatedValue: item.maxBuyPrice,
      note: item.comment,
    );
  }
}