import 'package:flutter_riverpod/flutter_riverpod.dart';

class ActivityTimelineTypeFilterNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void set(String? value) {
    state = value;
  }
}

final activityTimelineTypeFilterProvider =
    NotifierProvider<ActivityTimelineTypeFilterNotifier, String?>(ActivityTimelineTypeFilterNotifier.new);