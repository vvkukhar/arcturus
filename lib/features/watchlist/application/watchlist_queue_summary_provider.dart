import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_review_queue_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_summary_model.dart';

final watchlistQueueSummaryProvider =
    Provider<WatchlistQueueSummaryModel>((ref) {
  final items = ref.watch(watchlistReviewQueueProvider);

  int strong = 0;
  double totalSpread = 0;

  for (final item in items) {
    final spread = item.maxBuyPrice - (item.marketPrice ?? 0);
    totalSpread += spread;
    if (spread > 10) strong++;
  }

  return WatchlistQueueSummaryModel(
    total: items.length,
    strong: strong,
    avgSpread: items.isEmpty ? 0 : totalSpread / items.length,
  );
});