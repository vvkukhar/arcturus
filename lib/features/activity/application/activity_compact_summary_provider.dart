import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/latest_activity_provider.dart';
import 'package:lego_trading_manager/features/activity/application/activity_compact_summary_model.dart';

final activityCompactSummaryProvider =
    Provider<ActivityCompactSummaryModel>((ref) {
  final items = ref.watch(latestActivityProvider).value ?? [];
  int reports = 0;
  int purchases = 0;
  int sales = 0;
  for (final item in items) {
    if (item.type == 'report') reports++;
    if (item.type == 'purchase') purchases++;
    if (item.type == 'sale') sales++;
  }
  return ActivityCompactSummaryModel(
    total: items.length,
    reports: reports,
    purchases: purchases,
    sales: sales,
  );
});
