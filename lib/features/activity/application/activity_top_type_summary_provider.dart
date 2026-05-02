import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_top_type_summary_model.dart';
import 'package:lego_trading_manager/features/activity/application/latest_activity_provider.dart';

final activityTopTypeSummaryProvider =
    Provider<List<ActivityTopTypeSummaryModel>>((ref) {
  final items = ref.watch(latestActivityProvider).value ?? const [];
  final counts = <String, int>{};
  for (final item in items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  final result = counts.entries
      .map(
        (e) => ActivityTopTypeSummaryModel(
          type: e.key,
          count: e.value,
        ),
      )
      .toList();
  result.sort((a, b) => b.count.compareTo(a.count));
  return result;
});
