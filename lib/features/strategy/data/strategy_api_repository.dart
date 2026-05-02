import 'package:lego_trading_manager/core/network/api_client.dart';

class StrategyApiRepository {
  final ApiClient _api;

  StrategyApiRepository(this._api);

  Future<List<Map<String, dynamic>>> allocate(
    double capital,
    List<Map<String, dynamic>> candidates,
  ) async {
    final res = await _api.post(
      '/strategy/allocate',
      body: {
        'capital': capital,
        'candidates': candidates,
      },
    );

    return List<Map<String, dynamic>>.from(res as List);
  }

  Future<Map<String, dynamic>> risk(
    Map<String, dynamic> input,
  ) async {
    final res = await _api.post('/strategy/risk', body: input);
    return Map<String, dynamic>.from(res as Map);
  }

  Future<Map<String, dynamic>> profit(
    List<Map<String, dynamic>> trades,
  ) async {
    final res = await _api.post(
      '/strategy/profit',
      body: {
        'trades': trades,
      },
    );

    return Map<String, dynamic>.from(res as Map);
  }
}