import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunity_summary_model.dart';

final watchlistOpportunitySummaryProvider =
    Provider<WatchlistOpportunitySummaryModel>((ref) {
  final state = ref.watch(watchlistControllerProvider);
  final items = state.allItems;

  int underDesired = 0;
  int underMax = 0;
  int tooHigh = 0;

  for (final item in items) {
    final market = item.marketPrice;
    if (market == null) continue;

    if (market <= item.desiredBuyPrice) {
      underDesired++;
    } else if (market <= item.maxBuyPrice) {
      underMax++;
    } else {
      tooHigh++;
    }
  }

  return WatchlistOpportunitySummaryModel(
    underDesiredCount: underDesired,
    underMaxCount: underMax,
    tooHighCount: tooHigh,
  );
});