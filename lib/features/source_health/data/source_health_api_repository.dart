import 'package:lego_trading_manager/core/network/api_client.dart';

class SourceHealthApiRepository {
  final ApiClient _apiClient;

  SourceHealthApiRepository(this._apiClient);

  Future<List<Map<String, dynamic>>> getSummary() async {
    final data = await _apiClient.get('/source-health/summary');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<List<Map<String, dynamic>>> getRuns({int limit = 30}) async {
    final data = await _apiClient.get('/source-health/runs?limit=$limit');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<List<Map<String, dynamic>>> getErrors({int limit = 50}) async {
    final data = await _apiClient.get('/source-health/errors?limit=$limit');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<Map<String, dynamic>> triggerRerun(String sourceCode) async {
    final data = await _apiClient.post(
      '/source-health/rerun',
      body: {'sourceCode': sourceCode},
    );
    return Map<String, dynamic>.from(data as Map);
  }
}