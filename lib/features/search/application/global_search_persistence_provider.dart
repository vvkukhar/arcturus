import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/search/application/global_search_persistence_service.dart';

final globalSearchPersistenceProvider =
    Provider<GlobalSearchPersistenceService>((ref) {
  return GlobalSearchPersistenceService(ref);
});
