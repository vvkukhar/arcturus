import 'package:flutter_riverpod/flutter_riverpod.dart';

enum ActivityDateRangeQuickFilter {
  all,
  today,
  last3days,
  last7days,
}

class ActivityDateRangeQuickFilterNotifier extends Notifier<ActivityDateRangeQuickFilter> {
  @override
  ActivityDateRangeQuickFilter build() => ActivityDateRangeQuickFilter.all;

  void set(ActivityDateRangeQuickFilter value) {
    state = value;
  }
}

final activityDateRangeQuickFilterProvider =
    NotifierProvider<ActivityDateRangeQuickFilterNotifier, ActivityDateRangeQuickFilter>(
  ActivityDateRangeQuickFilterNotifier.new,
);