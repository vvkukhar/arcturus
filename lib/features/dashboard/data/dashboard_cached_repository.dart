import 'package:lego_trading_manager/core/storage/cache_repository.dart';
import 'package:lego_trading_manager/features/dashboard/data/dashboard_api_repository.dart';

class DashboardCachedRepository {
  final DashboardApiRepository _api;
  final CacheRepository _cache;
  DashboardCachedRepository(this._api, this._cache);
  Future<Map<String, dynamic>> getFlowCounters() async {
    try {
      final result = await _api.getFlowCounters();
      await _cache.put('dashboard_flow_counters', result);
      return result;
    } catch (_) {
      final cached = await _cache.getMap('dashboard_flow_counters');
      if (cached != null) {
        return cached;
      }
      rethrow;
    }
  }

  Future<List<Map<String, dynamic>>> getPriorityQueue() async {
    try {
      final result = await _api.getPriorityQueue();
      await _cache.put('dashboard_priority_queue', result);
      return result;
    } catch (_) {
      final cached = await _cache.getList('dashboard_priority_queue');
      if (cached != null) {
        return cached;
      }
      rethrow;
    }
  }

  Future<void> patchCachedFlowCounters(Map<String, dynamic> value) async {
    await _cache.put('dashboard_flow_counters', value);
  }

  Future<Map<String, dynamic>?> getCachedFlowCounters() async {
    return _cache.getMap('dashboard_flow_counters');
  }
}
