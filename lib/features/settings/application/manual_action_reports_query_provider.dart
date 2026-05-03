import 'package:flutter_riverpod/flutter_riverpod.dart';

class ManualActionReportsQueryNotifier extends Notifier<String> {
  @override
  String build() => '';

  void set(String value) {
    state = value;
  }
}

final manualActionReportsQueryProvider =
    NotifierProvider<ManualActionReportsQueryNotifier, String>(
  ManualActionReportsQueryNotifier.new,
);