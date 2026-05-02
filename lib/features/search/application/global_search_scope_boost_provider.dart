import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_scope_boost_service.dart';

final globalSearchScopeBoostProvider =
    Provider<GlobalSearchScopeBoostService>((ref) {
  return const GlobalSearchScopeBoostService();
});
