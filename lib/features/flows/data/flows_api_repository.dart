import 'package:lego_trading_manager/core/network/api_client.dart';

class FlowsApiRepository {
  final ApiClient _api;

  FlowsApiRepository(this._api);

  Future<List<Map<String, dynamic>>> getPurchaseFlow() async {
    final data = await _api.get('/flows/purchase');
    return List<Map<String, dynamic>>.from(data);
  }

  Future<void> addToPurchaseFlow(String watchlistItemId) async {
    await _api.post('/flows/purchase/add', body: {
      'watchlistItemId': watchlistItemId,
    });
  }

  Future<void> markBought({
    required String id,
    required double price,
    required int qty,
  }) async {
    await _api.patch('/flows/purchase/mark-bought', body: {
      'id': id,
      'purchasePrice': price,
      'quantity': qty,
    });
  }

  Future<void> updatePurchaseStatus(String id, String status) async {
    await _api.patch('/flows/purchase/update-status', body: {
      'id': id,
      'status': status,
    });
  }

  Future<List<Map<String, dynamic>>> getRepriceFlow() async {
    final data = await _api.get('/flows/reprice');
    return List<Map<String, dynamic>>.from(data);
  }

  Future<void> addToRepriceFlow(String inventoryItemId) async {
    await _api.post('/flows/reprice/add', body: {
      'inventoryItemId': inventoryItemId,
    });
  }

  Future<void> markListed({
    required String id,
    required double price,
  }) async {
    await _api.patch('/flows/reprice/mark-listed', body: {
      'id': id,
      'price': price,
    });
  }

  Future<void> updateRepriceStatus(String id, String status) async {
    await _api.patch('/flows/reprice/update-status', body: {
      'id': id,
      'status': status,
    });
  }

  Future<List<Map<String, dynamic>>> getReviewFlow() async {
    final data = await _api.get('/flows/review');
    return List<Map<String, dynamic>>.from(data);
  }

  Future<void> addToReviewFlow(String inventoryItemId) async {
    await _api.post('/flows/review/add', body: {
      'inventoryItemId': inventoryItemId,
    });
  }

  Future<void> markReviewed({
    required String id,
    String? note,
  }) async {
    await _api.patch('/flows/review/mark-reviewed', body: {
      'id': id,
      'note': note,
    });
  }
}