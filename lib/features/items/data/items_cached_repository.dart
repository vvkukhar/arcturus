import 'package:lego_trading_manager/core/storage/cache_repository.dart';
import 'package:lego_trading_manager/features/items/data/items_api_repository.dart';

class ItemsCachedRepository {
  final ItemsApiRepository _api;
  final CacheRepository _cache;
  ItemsCachedRepository(this._api, this._cache);
  Future<List<Map<String, dynamic>>> searchItems(
    String query, {
    int limit = 30,
  }) async {
    final key = 'items_search_$query';
    try {
      final result = await _api.searchItems(query, limit: limit);
      await _cache.put(key, result);
      return result;
    } catch (_) {
      final cached = await _cache.getList(key);
      if (cached != null) {
        return cached;
      }
      rethrow;
    }
  }
}
