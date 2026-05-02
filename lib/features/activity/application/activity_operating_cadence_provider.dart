import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_operating_cadence_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_control_score_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_rhythm_provider.dart';

final activityOperatingCadenceProvider =
    Provider<ActivityOperatingCadenceModel>((ref) {
  final rhythm = ref.watch(activityWeeklyRhythmProvider);
  final control = ref.watch(activityWeeklyControlScoreProvider);

  final label = rhythm.activeDaysInLast7 >= 6 && control.score >= 70
      ? 'strong operating cadence'
      : rhythm.activeDaysInLast7 >= 4 && control.score >= 45
          ? 'stable operating cadence'
          : rhythm.activeDaysInLast7 >= 2
              ? 'light operating cadence'
              : 'broken operating cadence';

  return ActivityOperatingCadenceModel(
    label: label,
    weeklyActiveDays: rhythm.activeDaysInLast7,
    controlScore: control.score,
  );
});