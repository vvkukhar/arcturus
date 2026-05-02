import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_visible_items_provider.dart';

class WatchlistMetricsModel {
  final int totalCount;
  final int visibleCount;
  final int activeCount;
  final int inactiveCount;
  final int withMarketCount;
  final int opportunityCount;

  const WatchlistMetricsModel({
    required this.totalCount,
    required this.visibleCount,
    required this.activeCount,
    required this.inactiveCount,
    required this.withMarketCount,
    required this.opportunityCount,
  });
}

final watchlistMetricsProvider = Provider<WatchlistMetricsModel>((ref) {
  final allItems = ref.watch(watchlistControllerProvider).allItems;
  final visibleItems = ref.watch(watchlistVisibleItemsProvider);

  final activeCount = allItems.where((item) => item.isActive).length;
  final inactiveCount = allItems.length - activeCount;
  final withMarketCount = allItems.where((item) => item.marketPrice != null).length;

  final opportunityCount = allItems.where((item) {
    final market = item.marketPrice;
    return item.isActive && market != null && market <= item.maxBuyPrice;
  }).length;

  return WatchlistMetricsModel(
    totalCount: allItems.length,
    visibleCount: visibleItems.length,
    activeCount: activeCount,
    inactiveCount: inactiveCount,
    withMarketCount: withMarketCount,
    opportunityCount: opportunityCount,
  );
});