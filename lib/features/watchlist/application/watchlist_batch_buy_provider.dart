import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_batch_buy_service.dart';

final watchlistBatchBuyProvider =
    Provider<WatchlistBatchBuyService>((ref) {
  return const WatchlistBatchBuyService();
});