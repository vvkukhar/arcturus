import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/activity_balance_summary_model.dart';
import 'package:lego_trading_manager/features/activity/application/latest_activity_provider.dart';

final activityBalanceSummaryProvider =
    Provider<ActivityBalanceSummaryModel>((ref) {
  final items = ref.watch(latestActivityProvider).value ?? const [];
  int reports = 0;
  int purchases = 0;
  int sales = 0;
  int other = 0;

  for (final item in items) {
    switch (item.type) {
      case 'report':
        reports++;
        break;
      case 'purchase':
        purchases++;
        break;
      case 'sale':
        sales++;
        break;
      default:
        other++;
    }
  }

  return ActivityBalanceSummaryModel(
    reports: reports,
    purchases: purchases,
    sales: sales,
    other: other,
  );
});
