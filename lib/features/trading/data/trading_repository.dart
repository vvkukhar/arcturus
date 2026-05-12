import 'package:lego_trading_manager/core/network/network_core.dart';

class TradingRepository {
  final NetworkCore _apiClient;

  TradingRepository(this._apiClient);

  Future<String> createCheckoutSession(String orderId) async {
    final response = await _apiClient.request('POST', '/payments/checkout/$orderId');
    return response['url'] as String;
  }

  Future<List<dynamic>> getAiSuggestions() async {
    final response = await _apiClient.request('GET', '/ai/suggestions');
    return response as List<dynamic>;
  }

  Future<Map<String, dynamic>> explainDeal(Map<String, dynamic> params) async {
    final response = await _apiClient.request('POST', '/ai/explain-deal', body: params);
    return response as Map<String, dynamic>;
  }
}