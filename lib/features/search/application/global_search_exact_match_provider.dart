import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_query_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_top_result_provider.dart';

final globalSearchExactMatchProvider = Provider<bool>((ref) {
  final query = ref.watch(globalSearchQueryProvider).trim().toLowerCase();
  final top = ref.watch(globalSearchTopResultProvider);
  if (query.isEmpty || top == null) return false;
  return top.title.trim().toLowerCase() == query;
});
