import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_simulation_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_available_cash_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_buy_power_ratio_model.dart';

final watchlistQueueBuyPowerRatioProvider =
    Provider<WatchlistQueueBuyPowerRatioModel>((ref) {
  final spend = ref.watch(watchlistAutoBuySimulationProvider).totalSpend;
  final cash = ref.watch(watchlistAvailableCashProvider);

  // Виправлено кастинг num -> double
  final double ratio = cash <= 0 ? (spend > 0 ? double.infinity : 0.0) : spend / cash;

  return WatchlistQueueBuyPowerRatioModel(
    spend: spend,
    cash: cash,
    ratio: ratio,
  );
});