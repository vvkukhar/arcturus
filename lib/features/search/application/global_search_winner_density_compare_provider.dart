import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_dominance_ratio_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_relevance_density_provider.dart';

class GlobalSearchWinnerDensityCompareModel {
  final double score;
  final String label;

  const GlobalSearchWinnerDensityCompareModel({
    required this.score,
    required this.label,
  });
}

final globalSearchWinnerDensityCompareProvider =
    Provider<GlobalSearchWinnerDensityCompareModel?>((ref) {
  final dominance = ref.watch(globalSearchDominanceRatioProvider);
  final density = ref.watch(globalSearchRelevanceDensityProvider);
  if (dominance == null || density.ratio == 0) return null;

  double score = (dominance.ratio * 30) + (density.ratio * 70);
  if (score > 100) score = 100;

  final label = score >= 75
      ? 'winner and density aligned strongly'
      : score >= 50
          ? 'winner and density moderately aligned'
          : 'winner and density weakly aligned';

  return GlobalSearchWinnerDensityCompareModel(
    score: score,
    label: label,
  );
});
