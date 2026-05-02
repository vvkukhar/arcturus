import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_balance_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_execution_maturity_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_risk_reward_provider.dart';

final watchlistExecutionBalanceProvider =
    Provider<WatchlistExecutionBalanceModel>((ref) {
  final maturity = ref.watch(watchlistExecutionMaturityProvider);
  final riskReward = ref.watch(watchlistQueueRiskRewardProvider);

  double score = maturity.score;
  if (riskReward.rewardGap > 0) {
    score += 10;
  } else {
    score -= 15;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  final label = score >= 75
      ? 'balanced execution'
      : score >= 50
          ? 'partially balanced execution'
          : 'imbalanced execution';

  return WatchlistExecutionBalanceModel(
    score: score,
    label: label,
  );
});