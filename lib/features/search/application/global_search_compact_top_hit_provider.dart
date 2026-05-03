import 'package:flutter_riverpod/flutter_riverpod.dart';

class GlobalSearchCompactTopHitNotifier extends Notifier<bool> {
  @override
  bool build() => false;

  void set(bool value) {
    state = value;
  }
}

final globalSearchCompactTopHitProvider =
    NotifierProvider<GlobalSearchCompactTopHitNotifier, bool>(
  GlobalSearchCompactTopHitNotifier.new,
);