// lib/app/providers/cache_repository_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/datasources/cache/shared_prefs_cache_datasource.dart';
import 'package:lego_trading_manager/data/repositories/cache_repository.dart';

final cacheRepositoryProvider = Provider<CacheRepository>((ref) {
  return CacheRepository(SharedPrefsCacheDatasource());
});
