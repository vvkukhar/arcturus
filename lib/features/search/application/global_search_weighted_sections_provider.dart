import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_weighted_section_model.dart';

final globalSearchWeightedSectionsProvider =
    Provider<List<GlobalSearchWeightedSectionModel>>((ref) {
  final results = ref.watch(globalSearchProvider);

  final totals = <String, int>{};
  final counts = <String, int>{};

  for (final item in results) {
    totals[item.type] = (totals[item.type] ?? 0) + item.priorityScore;
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }

  String titleFor(String type) {
    switch (type) {
      case 'inventory':
        return 'Inventory';
      case 'watchlist':
        return 'Watchlist';
      case 'purchase':
        return 'Purchases';
      case 'sale':
        return 'Sales';
      case 'market':
        return 'Market';
      default:
        return 'Other';
    }
  }

  final sections = totals.entries
      .map(
        (entry) => GlobalSearchWeightedSectionModel(
          type: entry.key,
          title: titleFor(entry.key),
          totalScore: entry.value,
          count: counts[entry.key] ?? 0,
        ),
      )
      .toList();

  sections.sort((a, b) => b.totalScore.compareTo(a.totalScore));
  return sections;
});