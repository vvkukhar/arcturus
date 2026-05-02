import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_day_insight_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_provider.dart';

final activityDayInsightProvider = Provider<ActivityDayInsightModel?>((ref) {
  final items = ref.watch(activityGroupedDaySummaryProvider);
  if (items.isEmpty) return null;
  final sorted = [...items]..sort((a, b) => a.total.compareTo(b.total));
  final weakest = sorted.first;
  final best = sorted.last;
  return ActivityDayInsightModel(
    bestDay: best.dateLabel,
    bestDayTotal: best.total,
    weakestDay: weakest.dateLabel,
    weakestDayTotal: weakest.total,
  );
});
