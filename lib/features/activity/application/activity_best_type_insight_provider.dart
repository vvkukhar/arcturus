import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_best_type_insight_model.dart';
import 'package:lego_trading_manager/features/activity/application/activity_top_type_summary_provider.dart';

final activityBestTypeInsightProvider =
    Provider<ActivityBestTypeInsightModel?>((ref) {
  final items = ref.watch(activityTopTypeSummaryProvider);
  if (items.isEmpty) return null;
  final top = items.first;
  return ActivityBestTypeInsightModel(
    topType: top.type,
    count: top.count,
  );
});
