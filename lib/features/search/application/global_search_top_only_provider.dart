import 'package:flutter_riverpod/flutter_riverpod.dart';

class GlobalSearchTopOnlyNotifier extends Notifier<bool> {
  @override
  bool build() => false;

  void set(bool value) {
    state = value;
  }
}

final globalSearchTopOnlyProvider =
    NotifierProvider<GlobalSearchTopOnlyNotifier, bool>(
  GlobalSearchTopOnlyNotifier.new,
);