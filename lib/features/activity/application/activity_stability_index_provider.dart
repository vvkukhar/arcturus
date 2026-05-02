import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_system_balance_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_control_score_provider.dart';

class ActivityStabilityIndexModel {
  final double score;
  final String label;

  const ActivityStabilityIndexModel({
    required this.score,
    required this.label,
  });
}

final activityStabilityIndexProvider =
    Provider<ActivityStabilityIndexModel>((ref) {
  final balance = ref.watch(activitySystemBalanceProvider);
  final control = ref.watch(activityWeeklyControlScoreProvider);

  double score = (balance.score * 0.5) + (control.score * 0.5);
  final label = score >= 75
      ? 'high operating stability'
      : score >= 50
          ? 'moderate operating stability'
          : 'low operating stability';

  return ActivityStabilityIndexModel(
    score: score,
    label: label,
  );
});
