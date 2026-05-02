import 'package:flutter_riverpod/flutter_riverpod.dart';

enum ActivityDateRangeQuickFilter {
  all,
  today,
  last3days,
  last7days,
}

final activityDateRangeQuickFilterProvider =
    StateProvider<ActivityDateRangeQuickFilter>(
  (ref) => ActivityDateRangeQuickFilter.all,
);
