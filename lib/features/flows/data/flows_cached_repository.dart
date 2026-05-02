import 'package:lego_trading_manager/core/storage/cache_repository.dart';
import 'package:lego_trading_manager/features/flows/data/flows_api_repository.dart';

class FlowsCachedRepository {
  final FlowsApiRepository _api;
  final CacheRepository _cache;
  FlowsCachedRepository(this._api, this._cache);
  Future<List<Map<String, dynamic>>> getPurchaseFlow() async {
    try {
      final result = await _api.getPurchaseFlow();
      await _cache.put('purchase_flow', result);
      return result;
    } catch (_) {
      final cached = await _cache.getList('purchase_flow');
      if (cached != null) {
        return cached;
      }
      rethrow;
    }
  }

  Future<List<Map<String, dynamic>>> getRepriceFlow() async {
    try {
      final result = await _api.getRepriceFlow();
      await _cache.put('reprice_flow', result);
      return result;
    } catch (_) {
      final cached = await _cache.getList('reprice_flow');
      if (cached != null) {
        return cached;
      }
      rethrow;
    }
  }

  Future<List<Map<String, dynamic>>> getReviewFlow() async {
    try {
      final result = await _api.getReviewFlow();
      await _cache.put('review_flow', result);
      return result;
    } catch (_) {
      final cached = await _cache.getList('review_flow');
      if (cached != null) {
        return cached;
      }
      rethrow;
    }
  }

  Future<void> patchPurchaseFlow(List<Map<String, dynamic>> value) async {
    await _cache.put('purchase_flow', value);
  }

  Future<void> patchRepriceFlow(List<Map<String, dynamic>> value) async {
    await _cache.put('reprice_flow', value);
  }

  Future<void> patchReviewFlow(List<Map<String, dynamic>> value) async {
    await _cache.put('review_flow', value);
  }

  Future<List<Map<String, dynamic>>?> getCachedPurchaseFlow() async {
    return _cache.getList('purchase_flow');
  }

  Future<List<Map<String, dynamic>>?> getCachedRepriceFlow() async {
    return _cache.getList('reprice_flow');
  }

  Future<List<Map<String, dynamic>>?> getCachedReviewFlow() async {
    return _cache.getList('review_flow');
  }
}
