import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_top_only_provider.dart';

class GlobalSearchSectionModel {
  final String type;
  final String title;
  final List<GlobalSearchResultModel> items;

  const GlobalSearchSectionModel({
    required this.type,
    required this.title,
    required this.items,
  });
}

final globalSearchGroupedProvider =
    Provider<List<GlobalSearchSectionModel>>((ref) {
  final results = ref.watch(globalSearchProvider);
  final topOnly = ref.watch(globalSearchTopOnlyProvider);
  final grouped = <String, List<GlobalSearchResultModel>>{};

  for (final item in results) {
    grouped.putIfAbsent(item.type, () => []).add(item);
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

  final sections = grouped.entries.map((entry) {
    final sorted = [...entry.value]
      ..sort((a, b) => b.priorityScore.compareTo(a.priorityScore));

    return GlobalSearchSectionModel(
      type: entry.key,
      title: titleFor(entry.key),
      items: topOnly ? sorted.take(3).toList() : sorted,
    );
  }).toList();

  sections.sort((a, b) => b.items.length.compareTo(a.items.length));
  return sections;
});