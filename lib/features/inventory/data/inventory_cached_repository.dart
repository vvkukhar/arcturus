import 'package:lego_trading_manager/core/storage/cache_repository.dart';
import 'package:lego_trading_manager/features/inventory/data/inventory_api_repository.dart';

class InventoryCachedRepository {
  final InventoryApiRepository _api;
  final CacheRepository _cache;

  InventoryCachedRepository(this._api, this._cache);

  Future<List<Map<String, dynamic>>> getInventory() async {
    try {
      final result = await _api.getInventory();
      await _cache.put('inventory_all', result);
      return result;
    } catch (_) {
      final cached = await _cache.getList('inventory_all');
      if (cached != null) {
        return cached;
      }
      rethrow;
    }
  }

  Future<void> putInventoryCache(List<Map<String, dynamic>> items) async {
    await _cache.put('inventory_all', items);
  }
}