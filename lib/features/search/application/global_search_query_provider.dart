import 'package:flutter_riverpod/flutter_riverpod.dart';

class GlobalSearchQueryNotifier extends Notifier<String> {
  @override
  String build() => '';

  void set(String value) => state = value;
  void clear() => state = '';
}

final globalSearchQueryProvider =
    NotifierProvider<GlobalSearchQueryNotifier, String>(
  GlobalSearchQueryNotifier.new,
);