import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_cash_compare_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_simulation_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_available_cash_provider.dart';

final watchlistAutoBuyCashCompareProvider =
    Provider<WatchlistAutoBuyCashCompareModel>((ref) {
  final simulation = ref.watch(watchlistAutoBuySimulationProvider);
  final cash = ref.watch(watchlistAvailableCashProvider);
  final remaining = cash - simulation.totalSpend;

  return WatchlistAutoBuyCashCompareModel(
    totalSpend: simulation.totalSpend,
    availableCash: cash,
    remainingCash: remaining,
    enoughCash: remaining >= 0,
  );
});