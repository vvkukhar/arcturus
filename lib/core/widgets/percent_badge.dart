import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';

class MarketLinkWatchlistService {
  final WatchlistRepository repository;

  MarketLinkWatchlistService(this.repository);

  void syncMarketPrice({
    required String itemRef,
    required double averagePrice,
  }) {
    final all = repository.getAll();

    for (final item in all) {
      if (item.refId == itemRef) {
        repository.update(item.copyWith(marketPrice: averagePrice));
      }
    }
  }
}
