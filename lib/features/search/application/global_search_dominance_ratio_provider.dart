import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_weighted_sections_provider.dart';

class GlobalSearchDominanceRatioModel {
  final double ratio;
  final String label;

  const GlobalSearchDominanceRatioModel({
    required this.ratio,
    required this.label,
  });
}

final globalSearchDominanceRatioProvider =
    Provider<GlobalSearchDominanceRatioModel?>((ref) {
  final sections = ref.watch(globalSearchWeightedSectionsProvider);
  if (sections.isEmpty) return null;
  final winner = sections.first.totalScore.toDouble();
  final runnerUp =
      sections.length > 1 ? sections[1].totalScore.toDouble() : 0.0;
  final ratio = runnerUp <= 0 ? winner : winner / runnerUp;
  final label = ratio >= 2.0
      ? 'winner dominates strongly'
      : ratio >= 1.3
          ? 'winner dominates moderately'
          : 'winner only slightly ahead';
  return GlobalSearchDominanceRatioModel(
    ratio: ratio,
    label: label,
  );
});
