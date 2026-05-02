import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_simulation_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_trigger_candidates_provider.dart';

final watchlistAutoBuySimulationProvider =
    Provider<WatchlistAutoBuySimulationModel>((ref) {
  final items = ref.watch(watchlistAutoTriggerCandidatesProvider);

  double spend = 0;
  double target = 0;

  for (final item in items) {
    spend += item.marketPrice ?? 0.0;
    target += item.desiredBuyPrice;
  }

  return WatchlistAutoBuySimulationModel(
    totalCandidates: items.length,
    totalSpend: spend,
    totalTargetValue: target,
    estimatedSpread: target - spend,
  );
});