import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_priority_breakdown_model.dart';

final watchlistPriorityBreakdownProvider =
    Provider.family<WatchlistPriorityBreakdownModel?, String>((ref, id) {
  final item = ref.watch(watchlistControllerProvider.notifier).getById(id);

  if (item == null) return null;

  final market = item.marketPrice ?? item.maxBuyPrice;
  final spread = item.maxBuyPrice - item.desiredBuyPrice;
  final valueGap = item.maxBuyPrice - market;
  final activeBoost = item.isActive ? 20.0 : 0.0;
  final total = valueGap + spread + activeBoost;

  return WatchlistPriorityBreakdownModel(
    id: id,
    activeBoost: activeBoost,
    spreadScore: spread,
    valueGapScore: valueGap,
    total: total,
  );
});