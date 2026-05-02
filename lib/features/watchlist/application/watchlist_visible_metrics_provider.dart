import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_visible_provider.dart';

class WatchlistVisibleMetricsModel {
  final int visibleCount;
  final int activeCount;
  final int withMarketCount;
  final int underDesiredCount;
  final int underMaxCount;

  const WatchlistVisibleMetricsModel({
    required this.visibleCount,
    required this.activeCount,
    required this.withMarketCount,
    required this.underDesiredCount,
    required this.underMaxCount,
  });
}

final watchlistVisibleMetricsProvider =
    Provider<WatchlistVisibleMetricsModel>((ref) {
  final items = ref.watch(watchlistVisibleProvider);

  int active = 0;
  int withMarket = 0;
  int underDesired = 0;
  int underMax = 0;

  for (final item in items) {
    if (item.isActive) active++;

    final market = item.marketPrice;
    if (market == null) continue;

    withMarket++;

    if (market <= item.desiredBuyPrice) {
      underDesired++;
    }

    if (market <= item.maxBuyPrice) {
      underMax++;
    }
  }

  return WatchlistVisibleMetricsModel(
    visibleCount: items.length,
    activeCount: active,
    withMarketCount: withMarket,
    underDesiredCount: underDesired,
    underMaxCount: underMax,
  );
});