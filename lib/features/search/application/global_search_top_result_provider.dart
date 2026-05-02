import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';

final globalSearchTopResultProvider = Provider<GlobalSearchResultModel?>((ref) {
  final results = ref.watch(globalSearchProvider);
  if (results.isEmpty) return null;

  final sorted = [...results]
    ..sort((a, b) => b.priorityScore.compareTo(a.priorityScore));

  final top = sorted.first;

  return GlobalSearchResultModel(
    title: top.title,
    subtitle: top.subtitle,
    type: top.type,
    route: top.route,
    id: top.id,
    payload: top.payload,
    priorityScore: top.priorityScore,
  );
});