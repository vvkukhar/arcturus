import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_weakest_day_model.dart';

final activityWeakestDayProvider = Provider<ActivityWeakestDayModel?>((ref) {
  final items = ref.watch(activityGroupedDaySummaryProvider);
  if (items.isEmpty) return null;
  final sorted = [...items]..sort((a, b) => a.total.compareTo(b.total));
  final weakest = sorted.first;
  return ActivityWeakestDayModel(
    dateLabel: weakest.dateLabel,
    total: weakest.total,
  );
});
