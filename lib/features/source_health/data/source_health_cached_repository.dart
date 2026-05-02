import 'package:lego_trading_manager/core/storage/cache_repository.dart';
import 'package:lego_trading_manager/features/source_health/data/source_health_api_repository.dart';

class SourceHealthCachedRepository {
  final SourceHealthApiRepository _api;
  final CacheRepository _cache;

  SourceHealthCachedRepository(this._api, this._cache);

  Future<List<Map<String, dynamic>>> getHealth() async {
    try {
      final result = await _api.getSummary();
      await _cache.put('source_health', result);
      return result;
    } catch (_) {
      final cached = await _cache.getList('source_health');
      if (cached != null) return cached;
      rethrow;
    }
  }
}