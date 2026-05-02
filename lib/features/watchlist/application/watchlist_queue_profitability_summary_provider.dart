import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_review_queue_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_profitability_summary_model.dart';

final watchlistQueueProfitabilitySummaryProvider =
    Provider<WatchlistQueueProfitabilitySummaryModel>((ref) {
  final items = ref.watch(watchlistReviewQueueProvider);

  double estimatedBuyCost = 0;
  double estimatedMaxValue = 0;

  for (final item in items) {
    estimatedBuyCost += item.marketPrice ?? 0;
    estimatedMaxValue += item.maxBuyPrice;
  }

  return WatchlistQueueProfitabilitySummaryModel(
    total: items.length,
    estimatedBuyCost: estimatedBuyCost,
    estimatedMaxValue: estimatedMaxValue,
    estimatedProfitGap: estimatedMaxValue - estimatedBuyCost,
  );
});