import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_buy_power_ratio_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_pressure_model.dart';

final watchlistQueuePressureProvider =
    Provider<WatchlistQueuePressureModel>((ref) {
  final ratio = ref.watch(watchlistQueueBuyPowerRatioProvider).ratio;

  final label = ratio <= 0.7
      ? 'light'
      : ratio <= 1.0
          ? 'healthy'
          : ratio <= 1.2
              ? 'tight'
              : 'heavy';

  return WatchlistQueuePressureModel(
    label: label,
    ratio: ratio,
  );
});