import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_quick_buy_service.dart';

final watchlistQuickBuyProvider = Provider<WatchlistQuickBuyService>((ref) {
  return WatchlistQuickBuyService(ref);
});