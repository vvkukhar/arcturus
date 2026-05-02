import 'package:lego_trading_manager/core/storage/cache_repository.dart';
import 'package:lego_trading_manager/features/opportunities/data/opportunities_api_repository.dart';

class OpportunitiesCachedRepository {
  final OpportunitiesApiRepository _api;
  final CacheRepository _cache;
  OpportunitiesCachedRepository(this._api, this._cache);
  Future<List<Map<String, dynamic>>> getBestBuyOpportunities() async {
    try {
      final result = await _api.getBestBuyOpportunities();
      await _cache.put('opportunities_buy', result);
      return result;
    } catch (_) {
      final cached = await _cache.getList('opportunities_buy');
      if (cached != null) {
        return cached;
      }
      rethrow;
    }
  }

  Future<List<Map<String, dynamic>>> getBestSellOpportunities() async {
    try {
      final result = await _api.getBestSellOpportunities();
      await _cache.put('opportunities_sell', result);
      return result;
    } catch (_) {
      final cached = await _cache.getList('opportunities_sell');
      if (cached != null) {
        return cached;
      }
      rethrow;
    }
  }

  Future<void> patchCachedBuyOpportunities(
    List<Map<String, dynamic>> value,
  ) async {
    await _cache.put('opportunities_buy', value);
  }

  Future<void> patchCachedSellOpportunities(
    List<Map<String, dynamic>> value,
  ) async {
    await _cache.put('opportunities_sell', value);
  }

  Future<List<Map<String, dynamic>>?> getCachedBuyOpportunities() async {
    return _cache.getList('opportunities_buy');
  }

  Future<List<Map<String, dynamic>>?> getCachedSellOpportunities() async {
    return _cache.getList('opportunities_sell');
  }
}
