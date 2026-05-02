import 'package:lego_trading_manager/core/network/api_client.dart';

class MarketApiRepository {
  final ApiClient _apiClient;

  MarketApiRepository(this._apiClient);

  Future<Map<String, dynamic>?> getItemSnapshot(String itemId) async {
    final data = await _apiClient.get('/market/item/$itemId/snapshot');
    if (data == null) return null;
    return Map<String, dynamic>.from(data as Map);
  }

  Future<List<Map<String, dynamic>>> getItemListings(String itemId) async {
    final data = await _apiClient.get('/market/item/$itemId/listings');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<Map<String, dynamic>> refreshInventoryItem(
      String inventoryItemId) async {
    final data =
        await _apiClient.post('/market/inventory/$inventoryItemId/refresh');
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> refreshWatchlistItem(
      String watchlistItemId) async {
    final data =
        await _apiClient.post('/market/watchlist/$watchlistItemId/refresh');
    return Map<String, dynamic>.from(data as Map);
  }
}
