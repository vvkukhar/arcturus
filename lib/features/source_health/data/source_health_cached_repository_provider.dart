import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/source_health/data/source_health_api_repository_provider.dart';
import 'package:lego_trading_manager/features/source_health/data/source_health_cached_repository.dart';

final sourceHealthCachedRepositoryProvider =
    Provider<SourceHealthCachedRepository>((ref) {
  final api = ref.watch(sourceHealthApiRepositoryProvider);
  final cache = ref.watch(cacheRepositoryProvider);
  return SourceHealthCachedRepository(api, cache);
});