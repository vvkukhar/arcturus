import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_exact_match_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_query_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_query_sharpness_model.dart';

final globalSearchQuerySharpnessProvider =
    Provider<GlobalSearchQuerySharpnessModel>((ref) {
  final query = ref.watch(globalSearchQueryProvider).trim();
  final exact = ref.watch(globalSearchExactMatchProvider);
  final label = query.isEmpty
      ? 'No active query'
      : exact
          ? 'Very sharp query'
          : query.length >= 10
              ? 'Sharp query'
              : query.length >= 5
                  ? 'Moderate query'
                  : 'Broad query';

  return GlobalSearchQuerySharpnessModel(
    label: label,
    queryLength: query.length,
    hasExactTopHit: exact,
  );
});
