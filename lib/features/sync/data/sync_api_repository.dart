import 'package:lego_trading_manager/core/network/api_client.dart';

class SyncApiRepository {
  final ApiClient _apiClient;

  SyncApiRepository(this._apiClient);

  Future<Map<String, dynamic>> getDashboardSummary() async {
    final data = await _apiClient.get('/sync/dashboard/summary');
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> getItemStatus(String itemId) async {
    final data = await _apiClient.get('/sync/item/$itemId/status');
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> getSyncState() async {
    final data = await _apiClient.get('/sync/state');
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> refreshAll() async {
    final data = await _apiClient.post('/sync/refresh-all');
    return Map<String, dynamic>.from(data as Map);
  }
}