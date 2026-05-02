import 'package:lego_trading_manager/core/network/api_client.dart';

class DashboardApiRepository {
  final ApiClient _apiClient;
  DashboardApiRepository(this._apiClient);
  Future<Map<String, dynamic>> getFlowCounters() async {
    final data = await _apiClient.get('/dashboard/flow-counters');
    return Map<String, dynamic>.from(data as Map);
  }

  Future<List<Map<String, dynamic>>> getPriorityQueue() async {
    final data = await _apiClient.get('/dashboard/priority-queue');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }
}
