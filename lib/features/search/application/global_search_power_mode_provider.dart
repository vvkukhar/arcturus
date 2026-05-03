import 'package:flutter_riverpod/flutter_riverpod.dart';

class GlobalSearchPowerModeNotifier extends Notifier<bool> {
  @override
  bool build() => false;

  void set(bool value) {
    state = value;
  }
}

final globalSearchPowerModeProvider =
    NotifierProvider<GlobalSearchPowerModeNotifier, bool>(
  GlobalSearchPowerModeNotifier.new,
);