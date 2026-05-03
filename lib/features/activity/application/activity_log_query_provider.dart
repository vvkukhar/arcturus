import 'package:flutter_riverpod/flutter_riverpod.dart';

class ActivityLogQueryNotifier extends Notifier<String> {
  @override
  String build() => '';

  void set(String value) {
    state = value;
  }
}

final activityLogQueryProvider =
    NotifierProvider<ActivityLogQueryNotifier, String>(ActivityLogQueryNotifier.new);