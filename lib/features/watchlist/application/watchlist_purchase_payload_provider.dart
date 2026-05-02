import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_payload_service.dart';

final watchlistPurchasePayloadProvider =
    Provider<WatchlistPurchasePayloadService>((ref) {
  return const WatchlistPurchasePayloadService();
});