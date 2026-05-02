import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_grouped_day_summary_model.dart';
import 'package:lego_trading_manager/features/activity/application/latest_activity_provider.dart';

final activityGroupedDaySummaryProvider =
    Provider<List<ActivityGroupedDaySummaryModel>>((ref) {
  final items = ref.watch(latestActivityProvider).value ?? const [];
  final map = <String, List<dynamic>>{};

  for (final item in items) {
    final key = item.createdAt.toIso8601String().split('T').first;
    map.putIfAbsent(key, () => []).add(item);
  }

  return map.entries.map((entry) {
    int reports = 0;
    int purchases = 0;
    int sales = 0;

    for (final item in entry.value) {
      if (item.type == 'report') reports++;
      if (item.type == 'purchase') purchases++;
      if (item.type == 'sale') sales++;
    }

    return ActivityGroupedDaySummaryModel(
      dateLabel: entry.key,
      total: entry.value.length,
      reports: reports,
      purchases: purchases,
      sales: sales,
    );
  }).toList();
});
