import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/activity/application/latest_activity_provider.dart';

class ActivitySummaryModel {
  final int reports;
  final int purchases;
  final int sales;
  final int watchlist;

  const ActivitySummaryModel({
    required this.reports,
    required this.purchases,
    required this.sales,
    required this.watchlist,
  });
}

final activityTimelineSummaryProvider = Provider<ActivitySummaryModel>((ref) {
  final data = ref.watch(latestActivityProvider).value ?? [];
  int reports = 0;
  int purchases = 0;
  int sales = 0;
  int watchlist = 0;

  for (final item in data) {
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
      case 'watchlist':
        watchlist++;
        break;
    }
  }

  return ActivitySummaryModel(
    reports: reports,
    purchases: purchases,
    sales: sales,
    watchlist: watchlist,
  );
});
