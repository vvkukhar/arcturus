import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_consistency_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_rhythm_provider.dart';

class ActivityWeeklyControlScoreModel {
  final double score;
  final String label;

  const ActivityWeeklyControlScoreModel({
    required this.score,
    required this.label,
  });
}

final activityWeeklyControlScoreProvider =
    Provider<ActivityWeeklyControlScoreModel>((ref) {
  final consistency = ref.watch(activityConsistencyProvider);
  final rhythm = ref.watch(activityWeeklyRhythmProvider);

  double score = 0;
  if (rhythm.activeDaysInLast7 >= 6) {
    score += 50;
  } else if (rhythm.activeDaysInLast7 >= 4) {
    score += 35;
  } else if (rhythm.activeDaysInLast7 >= 2) {
    score += 20;
  }

  if (consistency.totalDaysTracked >= 14) {
    score += 30;
  } else if (consistency.totalDaysTracked >= 7) {
    score += 20;
  } else if (consistency.totalDaysTracked > 0) {
    score += 10;
  }

  final label = score >= 70
      ? 'high weekly control'
      : score >= 45
          ? 'moderate weekly control'
          : 'low weekly control';

  return ActivityWeeklyControlScoreModel(
    score: score,
    label: label,
  );
});
