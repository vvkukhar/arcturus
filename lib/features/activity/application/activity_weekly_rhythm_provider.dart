import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_rhythm_model.dart';

final activityWeeklyRhythmProvider = Provider<ActivityWeeklyRhythmModel>((ref) {
  return const ActivityWeeklyRhythmModel(
    activeDaysInLast7: 4,
    label: 'Balanced weekly rhythm',
  );
});