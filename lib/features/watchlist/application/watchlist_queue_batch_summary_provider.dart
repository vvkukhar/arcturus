import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_batch_summary_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_review_queue_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_review_queue_selection_provider.dart';

final watchlistQueueBatchSummaryProvider =
    Provider<WatchlistQueueBatchSummaryModel>((ref) {
  final queue = ref.watch(watchlistReviewQueueProvider);
  final selected = ref.watch(watchlistReviewQueueSelectionProvider);

  int count = 0;
  double market = 0;
  double maxValue = 0;

  for (final item in queue) {
    if (!selected.contains(item.id)) continue;
    count++;
    market += item.marketPrice ?? 0;
    maxValue += item.maxBuyPrice;
  }

  return WatchlistQueueBatchSummaryModel(
    selectedCount: count,
    selectedMarketTotal: market,
    selectedMaxTotal: maxValue,
  );
});