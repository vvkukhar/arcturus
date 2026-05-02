import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_database_provider.dart';
import 'package:lego_trading_manager/core/storage/cache_repository.dart';

final cacheRepositoryProvider = Provider<CacheRepository>((ref) {
  final database = ref.watch(appDatabaseProvider);
  return CacheRepository(database);
});
