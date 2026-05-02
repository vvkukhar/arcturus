import 'package:lego_trading_manager/core/network/api_client.dart';

class DecisionsApiRepository {
  final ApiClient _apiClient;

  DecisionsApiRepository(this._apiClient);

  Future<Map<String, dynamic>> recomputeInventoryDecision(
    String inventoryItemId,
  ) async {
    final data = await _apiClient
        .post('/decisions/inventory/$inventoryItemId/recompute');
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> recomputeWatchlistDecision(
    String watchlistItemId,
  ) async {
    final data = await _apiClient
        .post('/decisions/watchlist/$watchlistItemId/recompute');
    return Map<String, dynamic>.from(data as Map);
  }
}
