import 'package:flutter_riverpod/flutter_riverpod.dart';

enum GlobalSearchDensityMode {
  comfortable,
  compact,
}

class GlobalSearchDensityModeNotifier extends Notifier<GlobalSearchDensityMode> {
  @override
  GlobalSearchDensityMode build() => GlobalSearchDensityMode.comfortable;

  void set(GlobalSearchDensityMode value) {
    state = value;
  }
}

final globalSearchDensityModeProvider =
    NotifierProvider<GlobalSearchDensityModeNotifier, GlobalSearchDensityMode>(
  GlobalSearchDensityModeNotifier.new,
);