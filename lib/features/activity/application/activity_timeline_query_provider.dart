import 'package:flutter_riverpod/flutter_riverpod.dart';

class ActivityTimelineQueryNotifier extends Notifier<String> {
  @override
  String build() => '';

  void set(String value) {
    state = value;
  }
}

final activityTimelineQueryProvider =
    NotifierProvider<ActivityTimelineQueryNotifier, String>(ActivityTimelineQueryNotifier.new);