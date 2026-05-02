import 'package:lego_trading_manager/core/network/api_client.dart';

class WatchlistApiRepository {
  final ApiClient _apiClient;
  WatchlistApiRepository(this._apiClient);
  Future<List<Map<String, dynamic>>> getWatchlist() async {
    final data = await _apiClient.get('/watchlist');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<Map<String, dynamic>?> getWatchlistDecision(String id) async {
    final data = await _apiClient.get('/watchlist/$id/decision');
    if (data == null) return null;
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> addToPurchaseFlow(String watchlistItemId) async {
    final data = await _apiClient.post('/flows/purchase/$watchlistItemId');
    return Map<String, dynamic>.from(data as Map);
  }
}
