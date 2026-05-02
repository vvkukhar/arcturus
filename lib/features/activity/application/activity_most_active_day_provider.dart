import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_most_active_day_model.dart';

final activityMostActiveDayProvider =
    Provider<ActivityMostActiveDayModel?>((ref) {
  final items = ref.watch(activityGroupedDaySummaryProvider);
  if (items.isEmpty) return null;
  final sorted = [...items]..sort((a, b) => b.total.compareTo(a.total));
  final top = sorted.first;
  return ActivityMostActiveDayModel(
    dateLabel: top.dateLabel,
    total: top.total,
  );
});
