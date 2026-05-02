import 'package:flutter_riverpod/flutter_riverpod.dart';

enum ActivityTimelineViewMode {
  compact,
  detailed,
}

final activityTimelineViewModeProvider =
    StateProvider<ActivityTimelineViewMode>(
  (ref) => ActivityTimelineViewMode.detailed,
);
