import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/opportunities/data/opportunities_api_repository_provider.dart';
import 'package:lego_trading_manager/features/opportunities/data/opportunities_cached_repository.dart';

final opportunitiesCachedRepositoryProvider =
    Provider<OpportunitiesCachedRepository>((ref) {
  final api = ref.watch(opportunitiesApiRepositoryProvider);
  final cache = ref.watch(cacheRepositoryProvider);
  return OpportunitiesCachedRepository(api, cache);
});
