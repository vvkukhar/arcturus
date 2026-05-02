import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_reprice_candidates_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_review_candidates_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_sell_candidates_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_top_buy_candidates_provider.dart';

class DashboardQueueStatusSummaryModel {
  final int buyQueue;
  final int sellQueue;
  final int repriceQueue;
  final int reviewQueue;
  final String label;

  const DashboardQueueStatusSummaryModel({
    required this.buyQueue,
    required this.sellQueue,
    required this.repriceQueue,
    required this.reviewQueue,
    required this.label,
  });
}

final dashboardQueueStatusSummaryProvider =
    Provider<DashboardQueueStatusSummaryModel>((ref) {
  final buyQueue = ref.watch(watchlistTopBuyCandidatesProvider);
  final sellQueue = ref.watch(inventoryTopSellCandidatesProvider);
  final repriceQueue = ref.watch(inventoryTopRepriceCandidatesProvider);
  final reviewQueue = ref.watch(inventoryTopReviewCandidatesProvider);
  final label = buyQueue.isNotEmpty
      ? 'Buy queue is active'
      : sellQueue.isNotEmpty
          ? 'Sell queue is active'
          : repriceQueue.isNotEmpty
              ? 'Reprice queue is active'
              : reviewQueue.isNotEmpty
                  ? 'Review queue is active'
                  : 'All queues are calm';
  return DashboardQueueStatusSummaryModel(
    buyQueue: buyQueue.length,
    sellQueue: sellQueue.length,
    repriceQueue: repriceQueue.length,
    reviewQueue: reviewQueue.length,
    label: label,
  );
});
