import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_price_signal_service.dart';

final watchlistPriceSignalProvider =
    Provider<WatchlistPriceSignalService>((ref) {
  return const WatchlistPriceSignalService();
});