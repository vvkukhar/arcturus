import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_query_precision_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_query_provider.dart';

final globalSearchQueryPrecisionProvider =
    Provider<GlobalSearchQueryPrecisionModel>((ref) {
  final query = ref.watch(globalSearchQueryProvider).trim();
  final results = ref.watch(globalSearchProvider);

  int strongResults = 0;
  for (final item in results) {
    if (item.priorityScore >= 700) {
      strongResults++;
    }
  }

  final label = query.isEmpty
      ? 'No active query precision'
      : query.length >= 10 && strongResults >= 1
          ? 'High query precision'
          : query.length >= 5
              ? 'Moderate query precision'
              : 'Loose query precision';

  return GlobalSearchQueryPrecisionModel(
    label: label,
    queryLength: query.length,
    strongResults: strongResults,
  );
});