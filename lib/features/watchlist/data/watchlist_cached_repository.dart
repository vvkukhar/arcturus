import 'package:lego_trading_manager/core/storage/cache_repository.dart';
import 'package:lego_trading_manager/features/watchlist/data/watchlist_api_repository.dart';

class WatchlistCachedRepository {
  final WatchlistApiRepository _api;
  final CacheRepository _cache;

  WatchlistCachedRepository(this._api, this._cache);

  Future<List<Map<String, dynamic>>> getWatchlist() async {
    try {
      final result = await _api.getWatchlist();
      await _cache.put('watchlist_all', result);
      return result;
    } catch (_) {
      final cached = await _cache.getList('watchlist_all');
      if (cached != null) {
        return cached;
      }
      rethrow;
    }
  }

  Future<void> putWatchlistCache(List<Map<String, dynamic>> items) async {
    await _cache.put('watchlist_all', items);
  }
}