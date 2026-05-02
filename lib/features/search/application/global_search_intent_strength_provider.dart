import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_intent_strength_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';

final globalSearchIntentStrengthProvider =
    Provider<GlobalSearchIntentStrengthModel>((ref) {
  final results = ref.watch(globalSearchProvider);
  int exactCount = 0;

  for (final item in results) {
    if (item.priorityScore >= 900) exactCount++;
  }

  final label = results.isEmpty
      ? 'No search intent resolved'
      : exactCount >= 1
          ? 'Search intent is strongly resolved'
          : results.length <= 3
              ? 'Search intent is narrow'
              : results.length <= 10
                  ? 'Search intent is moderate'
                  : 'Search intent is broad';

  return GlobalSearchIntentStrengthModel(
    label: label,
    resultsCount: results.length,
    exactCount: exactCount,
  );
});
