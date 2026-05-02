import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/watchlist/data/watchlist_api_repository_provider.dart';
import 'package:lego_trading_manager/features/watchlist/data/watchlist_cached_repository.dart';

final watchlistCachedRepositoryProvider =
    Provider<WatchlistCachedRepository>((ref) {
  final api = ref.watch(watchlistApiRepositoryProvider);
  final cache = ref.watch(cacheRepositoryProvider);
  return WatchlistCachedRepository(api, cache);
});
