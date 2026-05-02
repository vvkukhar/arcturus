import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_retrieval_quality_model.dart';

final globalSearchRetrievalQualityProvider =
    Provider<GlobalSearchRetrievalQualityModel>((ref) {
  final results = ref.watch(globalSearchProvider);
  int strong = 0;

  for (final item in results) {
    if (item.priorityScore >= 700) strong++;
  }

  final label = results.isEmpty
      ? 'No retrieval signal'
      : strong >= 3
          ? 'High retrieval quality'
          : strong >= 1
              ? 'Moderate retrieval quality'
              : 'Weak retrieval quality';

  return GlobalSearchRetrievalQualityModel(
    label: label,
    totalResults: results.length,
    strongResults: strong,
  );
});
