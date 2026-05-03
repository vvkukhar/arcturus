import 'package:flutter_riverpod/flutter_riverpod.dart';

class DealHistoryQueryNotifier extends Notifier<String> {
  @override
  String build() => '';

  void set(String value) {
    state = value;
  }
}

final dealHistoryQueryProvider =
    NotifierProvider<DealHistoryQueryNotifier, String>(DealHistoryQueryNotifier.new);