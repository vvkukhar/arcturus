import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_weighted_section_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_weighted_sections_provider.dart';

final globalSearchSectionWinnerProvider =
    Provider<GlobalSearchWeightedSectionModel?>((ref) {
  final sections = ref.watch(globalSearchWeightedSectionsProvider);
  if (sections.isEmpty) return null;
  return sections.first;
});