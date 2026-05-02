import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_fuzzy_service.dart';

final globalSearchFuzzyProvider = Provider<GlobalSearchFuzzyService>((ref) {
  return const GlobalSearchFuzzyService();
});
