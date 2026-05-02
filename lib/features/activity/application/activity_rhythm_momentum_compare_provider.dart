import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_rhythm_momentum_compare_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_streak_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_rhythm_provider.dart';

final activityRhythmMomentumCompareProvider =
    Provider<ActivityRhythmMomentumCompareModel>((ref) {
  final rhythm = ref.watch(activityWeeklyRhythmProvider);
  final streak = ref.watch(activityStreakProvider);
  final label = streak.activeDayStreak >= rhythm.activeDaysInLast7
      ? 'Momentum leads rhythm'
      : rhythm.activeDaysInLast7 >= 5
          ? 'Rhythm leads momentum'
          : 'Rhythm and momentum are close';

  return ActivityRhythmMomentumCompareModel(
    label: label,
    weeklyActiveDays: rhythm.activeDaysInLast7,
    streakDays: streak.activeDayStreak,
  );
});
