import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/dashboard/data/dashboard_api_repository_provider.dart';
import 'package:lego_trading_manager/features/dashboard/data/dashboard_cached_repository.dart';

final dashboardCachedRepositoryProvider =
    Provider<DashboardCachedRepository>((ref) {
  final api = ref.watch(dashboardApiRepositoryProvider);
  final cache = ref.watch(cacheRepositoryProvider);
  return DashboardCachedRepository(api, cache);
});
