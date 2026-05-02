import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/market/application/market_link_watchlist_service.dart';

final marketLinkWatchlistServiceProvider =
    Provider<MarketLinkWatchlistService>((ref) {
  return MarketLinkWatchlistService(ref.read(watchlistRepositoryProvider));
});
