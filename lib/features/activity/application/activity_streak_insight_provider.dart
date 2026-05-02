import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_streak_insight_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_streak_provider.dart';

final activityStreakInsightProvider =
    Provider<ActivityStreakInsightModel>((ref) {
  final streak = ref.watch(activityStreakProvider);
  if (streak.activeDayStreak >= streak.purchaseDayStreak) {
    return ActivityStreakInsightModel(
      label: 'Best streak: activity',
      value: streak.activeDayStreak,
    );
  }
  return ActivityStreakInsightModel(
    label: 'Best streak: purchases',
    value: streak.purchaseDayStreak,
  );
});
