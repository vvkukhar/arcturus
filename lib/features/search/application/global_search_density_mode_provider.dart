import 'package:flutter_riverpod/flutter_riverpod.dart';

enum GlobalSearchDensityMode {
  comfortable,
  compact,
}

final globalSearchDensityModeProvider =
    StateProvider<GlobalSearchDensityMode>((ref) {
  return GlobalSearchDensityMode.comfortable;
});
