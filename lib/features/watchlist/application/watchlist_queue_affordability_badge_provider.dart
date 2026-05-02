import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_cash_compare_provider.dart';

final watchlistQueueAffordabilityBadgeProvider = Provider<String>((ref) {
  final compare = ref.watch(watchlistAutoBuyCashCompareProvider);

  if (compare.enoughCash) return 'affordable';
  if (compare.remainingCash > -1000) return 'tight';
  return 'over budget';
});