import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_actionable_summary_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_review_queue_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_review_queue_selection_provider.dart';

final watchlistQueueActionableSummaryProvider =
    Provider<WatchlistQueueActionableSummaryModel>((ref) {
  final queue = ref.watch(watchlistReviewQueueProvider);
  final selectedIds = ref.watch(watchlistReviewQueueSelectionProvider);

  int selectedCount = 0;
  double selectedSpend = 0;
  double selectedGap = 0;

  for (final item in queue) {
    if (!selectedIds.contains(item.id)) continue;

    selectedCount++;
    final market = item.marketPrice ?? 0;
    selectedSpend += market;
    selectedGap += item.maxBuyPrice - market;
  }

  final label = selectedCount == 0
      ? 'No queue items selected'
      : selectedGap > 0
          ? 'Selection has positive spread'
          : 'Selection needs review';

  return WatchlistQueueActionableSummaryModel(
    selectedCount: selectedCount,
    selectedSpend: selectedSpend,
    selectedGap: selectedGap,
    label: label,
  );
});