import 'package:flutter_riverpod/flutter_riverpod.dart';

class ActivityLogTypeFilterNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void set(String? value) {
    state = value;
  }
}

final activityLogTypeFilterProvider =
    NotifierProvider<ActivityLogTypeFilterNotifier, String?>(ActivityLogTypeFilterNotifier.new);