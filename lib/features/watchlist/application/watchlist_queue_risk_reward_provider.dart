import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_actionable_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_pressure_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_risk_reward_model.dart';

final watchlistQueueRiskRewardProvider =
    Provider<WatchlistQueueRiskRewardModel>((ref) {
  final actionable = ref.watch(watchlistQueueActionableSummaryProvider);
  final pressure = ref.watch(watchlistQueuePressureProvider);

  final label = actionable.selectedGap > 0 && pressure.label != 'heavy'
      ? 'Reward outweighs queue pressure'
      : actionable.selectedGap > 0
          ? 'Reward exists but pressure is high'
          : 'Risk outweighs reward';

  return WatchlistQueueRiskRewardModel(
    label: label,
    rewardGap: actionable.selectedGap,
    pressure: pressure.label,
  );
});