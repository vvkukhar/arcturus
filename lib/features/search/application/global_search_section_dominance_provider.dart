import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_section_dominance_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_weighted_sections_provider.dart';

final globalSearchSectionDominanceProvider =
    Provider<GlobalSearchSectionDominanceModel?>((ref) {
  final sections = ref.watch(globalSearchWeightedSectionsProvider);
  if (sections.isEmpty) return null;

  final winner = sections.first;
  final runnerUp = sections.length > 1 ? sections[1] : null;
  final label = runnerUp == null
      ? 'Single dominant section'
      : winner.totalScore - runnerUp.totalScore >= 300
          ? 'Strong section dominance'
          : winner.totalScore - runnerUp.totalScore >= 100
              ? 'Moderate section dominance'
              : 'Balanced section competition';

  return GlobalSearchSectionDominanceModel(
    label: label,
    winnerScore: winner.totalScore,
    runnerUpScore: runnerUp?.totalScore ?? 0,
  );
});
