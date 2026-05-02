import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_payload_model.dart';

class WatchlistPurchasePayloadService {
  const WatchlistPurchasePayloadService();

  WatchlistPurchasePayloadModel build(WatchlistItemModel item) {
    return WatchlistPurchasePayloadModel(
      title: item.title,
      source: _sourceFor(item),
      suggestedPrice: item.marketPrice ?? item.desiredBuyPrice,
      note: _noteFor(item),
    );
  }

  String _sourceFor(WatchlistItemModel item) {
    final theme = item.theme?.trim();
    if (theme == null || theme.isEmpty) return 'watchlist';
    return 'watchlist/$theme';
  }

  String _noteFor(WatchlistItemModel item) {
    return [
      'Created from watchlist',
      if ((item.refId ?? '').trim().isNotEmpty) 'ref=${item.refId}',
      'target=${item.desiredBuyPrice.toStringAsFixed(2)}',
      'max=${item.maxBuyPrice.toStringAsFixed(2)}',
      if (item.marketPrice != null)
        'market=${item.marketPrice!.toStringAsFixed(2)}',
      if ((item.comment ?? '').trim().isNotEmpty) item.comment!.trim(),
    ].join(' | ');
  }
}