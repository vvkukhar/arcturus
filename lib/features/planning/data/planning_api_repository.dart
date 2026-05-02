import 'package:lego_trading_manager/core/network/api_client.dart';

class PlanningApiRepository {
  final ApiClient _api;

  PlanningApiRepository(this._api);

  Future<List<Map<String, dynamic>>> getDailyPlan() async {
    final res = await _api.get('/planning/daily');
    return List<Map<String, dynamic>>.from(res);
  }
}