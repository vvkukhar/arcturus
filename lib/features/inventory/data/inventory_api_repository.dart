import 'package:lego_trading_manager/core/network/api_client.dart';

class InventoryApiRepository {
  final ApiClient _apiClient;
  InventoryApiRepository(this._apiClient);
  Future<List<Map<String, dynamic>>> getInventory() async {
    final data = await _apiClient.get('/inventory');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<Map<String, dynamic>?> getInventoryDecision(String id) async {
    final data = await _apiClient.get('/inventory/$id/decision');
    if (data == null) return null;
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> addToRepriceFlow(String inventoryItemId) async {
    final data = await _apiClient.post('/flows/reprice/$inventoryItemId');
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> addToReviewFlow(
    String inventoryItemId,
    String reason,
  ) async {
    final data = await _apiClient.post(
      '/flows/review/$inventoryItemId',
      body: {'reason': reason},
    );
    return Map<String, dynamic>.from(data as Map);
  }
}
