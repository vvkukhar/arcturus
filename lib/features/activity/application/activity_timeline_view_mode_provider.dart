import 'package:flutter_riverpod/flutter_riverpod.dart';

enum ActivityTimelineViewMode {
  compact,
  detailed,
}

class ActivityTimelineViewModeNotifier extends Notifier<ActivityTimelineViewMode> {
  @override
  ActivityTimelineViewMode build() => ActivityTimelineViewMode.detailed;

  void set(ActivityTimelineViewMode value) {
    state = value;
  }
}

final activityTimelineViewModeProvider =
    NotifierProvider<ActivityTimelineViewModeNotifier, ActivityTimelineViewMode>(
  ActivityTimelineViewModeNotifier.new,
);