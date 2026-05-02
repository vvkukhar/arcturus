import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_control_momentum_compare_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_system_balance_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_control_score_provider.dart';

final activitySystemBalanceProvider =
    Provider<ActivitySystemBalanceModel>((ref) {
  final compare = ref.watch(activityControlMomentumCompareProvider);
  final control = ref.watch(activityWeeklyControlScoreProvider);

  double score = control.score;
  if (compare.label == 'control and momentum aligned') {
    score += 15;
  } else if (compare.label == 'control leads momentum') {
    score += 5;
  } else {
    score -= 10;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  final label = score >= 75
      ? 'system balance is strong'
      : score >= 50
          ? 'system balance is workable'
          : 'system balance is weak';

  return ActivitySystemBalanceModel(
    score: score,
    label: label,
  );
});