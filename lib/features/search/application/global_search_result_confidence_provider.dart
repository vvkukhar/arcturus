import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';

final globalSearchResultConfidenceProvider =
    Provider.family<String, GlobalSearchResultModel>((ref, result) {
  final score = result.priorityScore;
  if (score >= 900) return 'exact';
  if (score >= 700) return 'strong';
  if (score >= 500) return 'good';
  return 'loose';
});
