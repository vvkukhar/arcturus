import 'package:flutter_riverpod/flutter_riverpod.dart';

class GlobalSearchTypeFilterNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void set(String? value) => state = value;
  void clear() => state = null;
}

final globalSearchTypeFilterProvider =
    NotifierProvider<GlobalSearchTypeFilterNotifier, String?>(
  GlobalSearchTypeFilterNotifier.new,
);