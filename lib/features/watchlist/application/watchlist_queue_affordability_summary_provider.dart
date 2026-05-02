import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_cash_compare_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_affordability_summary_model.dart';

final watchlistQueueAffordabilitySummaryProvider =
    Provider<WatchlistQueueAffordabilitySummaryModel>((ref) {
  final compare = ref.watch(watchlistAutoBuyCashCompareProvider);

  final label = compare.enoughCash
      ? 'Queue is fully affordable'
      : 'Queue exceeds available cash';

  return WatchlistQueueAffordabilitySummaryModel(
    label: label,
    remainingCash: compare.remainingCash,
    enoughCash: compare.enoughCash,
  );
});