import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_create_service.dart';

final watchlistPurchaseCreateProvider =
    Provider<WatchlistPurchaseCreateService>((ref) {
  return const WatchlistPurchaseCreateService();
});