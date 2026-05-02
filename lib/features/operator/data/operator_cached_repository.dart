import 'package:lego_trading_manager/core/storage/cache_repository.dart';
import 'package:lego_trading_manager/features/operator/data/operator_api_repository.dart';

class OperatorCachedRepository {
  final OperatorApiRepository _api;
  final CacheRepository _cache;
  OperatorCachedRepository(this._api, this._cache);
  Future<Map<String, dynamic>> getHealth() async {
    try {
      final result = await _api.getHealth();
      await _cache.put('operator_health', result);
      return result;
    } catch (_) {
      final cached = await _cache.getMap('operator_health');
      if (cached != null) return cached;
      rethrow;
    }
  }
}
