import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_confidence_mix_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';

final globalSearchConfidenceMixProvider =
    Provider<GlobalSearchConfidenceMixModel>((ref) {
  final results = ref.watch(globalSearchProvider);

  int exact = 0;
  int strong = 0;
  int good = 0;
  int loose = 0;

  for (final item in results) {
    final score = item.priorityScore;

    if (score >= 900) {
      exact++;
    } else if (score >= 700) {
      strong++;
    } else if (score >= 500) {
      good++;
    } else {
      loose++;
    }
  }

  return GlobalSearchConfidenceMixModel(
    exact: exact,
    strong: strong,
    good: good,
    loose: loose,
  );
});
