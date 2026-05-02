import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_consistency_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weekly_stability_model.dart';

final activityWeeklyStabilityProvider =
    Provider<ActivityWeeklyStabilityModel>((ref) {
  final consistency = ref.watch(activityConsistencyProvider);
  final activeDaysInLast7 = consistency.activeDaysInLast7;

  final label = consistency.totalDaysTracked == 0
      ? 'No weekly stability yet'
      : activeDaysInLast7 >= 6
          ? 'Weekly stability is very strong'
          : activeDaysInLast7 >= 4
              ? 'Weekly stability is stable'
              : activeDaysInLast7 >= 2
                  ? 'Weekly stability is fragile'
                  : 'Weekly stability is weak';

  return ActivityWeeklyStabilityModel(
    label: label,
    activeDaysInLast7: activeDaysInLast7,
    totalTrackedDays: consistency.totalDaysTracked,
  );
});