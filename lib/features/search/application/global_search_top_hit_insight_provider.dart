import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_top_hit_insight_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_top_result_provider.dart';

final globalSearchTopHitInsightProvider =
    Provider<GlobalSearchTopHitInsightModel?>((ref) {
  final top = ref.watch(globalSearchTopResultProvider);
  if (top == null) return null;

  final score = top.priorityScore;
  final level = score >= 900
      ? 'exact'
      : score >= 700
          ? 'strong'
          : score >= 500
              ? 'good'
              : 'loose';

  return GlobalSearchTopHitInsightModel(
    title: top.title,
    score: score,
    level: level,
  );
});
