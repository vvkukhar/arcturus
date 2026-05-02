import 'package:lego_trading_manager/core/network/api_client.dart';

class OpportunitiesApiRepository {
  final ApiClient _apiClient;

  OpportunitiesApiRepository(this._apiClient);

  Future<List<Map<String, dynamic>>> getBestBuyOpportunities({
    int limit = 20,
  }) async {
    final data = await _apiClient.get('/opportunities/buy?limit=$limit');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<List<Map<String, dynamic>>> getBestSellOpportunities({
    int limit = 20,
  }) async {
    final data = await _apiClient.get('/opportunities/sell?limit=$limit');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<List<Map<String, dynamic>>> getBestRepriceOpportunities({
    int limit = 20,
  }) async {
    final data = await _apiClient.get('/opportunities/reprice?limit=$limit');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<List<Map<String, dynamic>>> getBestReviewOpportunities({
    int limit = 20,
  }) async {
    final data = await _apiClient.get('/opportunities/review?limit=$limit');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<Map<String, dynamic>?> getProfitabilityBreakdown({
    required String contextType,
    required String contextId,
  }) async {
    final data = await _apiClient.get(
      '/opportunities/profitability/$contextType/$contextId',
    );
    if (data == null) return null;
    return Map<String, dynamic>.from(data as Map);
  }
}
