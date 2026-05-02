import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class WatchlistQueueBuilder {
  const WatchlistQueueBuilder();

  List<WatchlistItemModel> build(List<WatchlistItemModel> items) {
    final active = items.where((e) => e.isActive).toList();

    active.sort((a, b) {
      final aScore = _score(a);
      final bScore = _score(b);
      return bScore.compareTo(aScore);
    });

    return active;
  }

  double _score(WatchlistItemModel item) {
    final market = item.marketPrice;
    if (market == null) return 0;

    double score = 0;

    final gap = item.maxBuyPrice - market;
    score += gap;

    if (market <= item.desiredBuyPrice) {
      score += 20;
    }

    if (item.isActive) {
      score += 10;
    }

    return score;
  }
}