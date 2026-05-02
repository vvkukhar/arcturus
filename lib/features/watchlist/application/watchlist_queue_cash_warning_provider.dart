import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_cash_compare_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_cash_warning_model.dart';

final watchlistQueueCashWarningProvider =
    Provider<WatchlistQueueCashWarningModel>((ref) {
  final compare = ref.watch(watchlistAutoBuyCashCompareProvider);

  if (compare.enoughCash) {
    return const WatchlistQueueCashWarningModel(
      hasWarning: false,
      shortage: 0,
    );
  }

  return WatchlistQueueCashWarningModel(
    hasWarning: true,
    shortage: compare.remainingCash.abs(),
  );
});