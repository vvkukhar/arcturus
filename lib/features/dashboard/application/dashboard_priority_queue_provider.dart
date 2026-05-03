import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_reprice_candidates_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_review_candidates_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_top_sell_candidates_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_top_buy_candidates_provider.dart';

class DashboardPriorityQueueItemModel {
  final String title;
  final String type;
  final double score;
  final String reason;

  const DashboardPriorityQueueItemModel({
    required this.title,
    required this.type,
    required this.score,
    required this.reason,
  });
}

final dashboardPriorityQueueProvider = Provider<List<DashboardPriorityQueueItemModel>>((ref) {
  final buy = ref.watch(watchlistTopBuyCandidatesProvider);
  final sell = ref.watch(inventoryTopSellCandidatesProvider);
  final reprice = ref.watch(inventoryTopRepriceCandidatesProvider);
  final review = ref.watch(inventoryTopReviewCandidatesProvider);
  
  final result = <DashboardPriorityQueueItemModel>[
    ...buy.map((e) => DashboardPriorityQueueItemModel(title: e.title, type: 'buy', score: e.score, reason: e.reason)),
    ...sell.map((e) => DashboardPriorityQueueItemModel(title: e.title, type: 'sell', score: e.score, reason: e.reason)),
    ...reprice.map((e) => DashboardPriorityQueueItemModel(title: e.title, type: 'reprice', score: e.score, reason: e.reason)),
    ...review.map((e) => DashboardPriorityQueueItemModel(title: e.title, type: 'review', score: e.score, reason: e.reason)),
  ];
  
  result.sort((a, b) => b.score.compareTo(a.score));
  return result.take(12).toList();
});