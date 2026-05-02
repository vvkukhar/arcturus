import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_to_purchase_draft_service.dart';

final watchlistToPurchaseDraftProvider =
    Provider<WatchlistToPurchaseDraftService>((ref) {
  return WatchlistToPurchaseDraftService();
});