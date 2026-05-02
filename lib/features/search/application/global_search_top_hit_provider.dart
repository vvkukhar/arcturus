import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';

final globalSearchTopHitProvider = Provider((ref) {
  final results = ref.watch(globalSearchProvider);
  if (results.isEmpty) return null;

  final sorted = [...results]
    ..sort((a, b) => b.priorityScore.compareTo(a.priorityScore));

  return sorted.first;
});