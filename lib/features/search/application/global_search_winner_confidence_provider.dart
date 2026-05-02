import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_top_hit_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_winner_confidence_model.dart';

final globalSearchWinnerConfidenceProvider =
    Provider<GlobalSearchWinnerConfidenceModel?>((ref) {
  final top = ref.watch(globalSearchTopHitProvider);
  if (top == null) return null;

  final score = top.priorityScore;
  final label = score >= 900
      ? 'very high confidence winner'
      : score >= 700
          ? 'strong confidence winner'
          : score >= 500
              ? 'moderate confidence winner'
              : 'weak confidence winner';

  return GlobalSearchWinnerConfidenceModel(
    label: label,
    topScore: score,
  );
});
