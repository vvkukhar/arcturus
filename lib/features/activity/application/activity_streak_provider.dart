import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_streak_model.dart';
import 'package:lego_trading_manager/features/activity/application/latest_activity_provider.dart';

final activityStreakProvider = Provider<ActivityStreakModel>((ref) {
  final items = ref.watch(latestActivityProvider).value ?? const [];
  final uniqueDays = <String>{};
  final purchaseDays = <String>{};
  for (final item in items) {
    final key = item.createdAt.toIso8601String().split('T').first;
    uniqueDays.add(key);
    if (item.type == 'purchase') {
      purchaseDays.add(key);
    }
  }

  int calcStreak(Set<String> dayKeys) {
    int streak = 0;
    var cursor = DateTime.now();
    while (true) {
      final key = DateTime(cursor.year, cursor.month, cursor.day)
          .toIso8601String()
          .split('T')
          .first;
      if (dayKeys.contains(key)) {
        streak++;
        cursor = cursor.subtract(const Duration(days: 1));
      } else {
        break;
      }
    }
    return streak;
  }

  return ActivityStreakModel(
    activeDayStreak: calcStreak(uniqueDays),
    purchaseDayStreak: calcStreak(purchaseDays),
  );
});
