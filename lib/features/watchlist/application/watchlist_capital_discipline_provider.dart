import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_capital_discipline_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_buy_power_ratio_provider.dart';

final watchlistCapitalDisciplineProvider =
    Provider<WatchlistCapitalDisciplineModel>((ref) {
  final ratio = ref.watch(watchlistQueueBuyPowerRatioProvider).ratio;

  final label = ratio <= 0.7
      ? 'Strong capital discipline'
      : ratio <= 1.0
          ? 'Healthy capital discipline'
          : ratio <= 1.2
              ? 'Tight capital discipline'
              : 'Weak capital discipline';

  return WatchlistCapitalDisciplineModel(
    label: label,
    ratio: ratio,
  );
});