import 'package:lego_trading_manager/core/network/api_client.dart';

class ItemsApiRepository {
  final ApiClient _apiClient;

  ItemsApiRepository(this._apiClient);

  Future<List<Map<String, dynamic>>> searchItems(
    String query, {
    int limit = 30,
  }) async {
    final data = await _apiClient.get(
      '/items/search?q=${Uri.encodeQueryComponent(query)}&limit=$limit',
    );
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<Map<String, dynamic>> createItem({
    required String title,
    String? setNumber,
    String? theme,
    int? year,
  }) async {
    final data = await _apiClient.post(
      '/items/create',
      body: {
        'title': title,
        'setNumber': setNumber,
        'theme': theme,
        'year': year,
      },
    );
    return Map<String, dynamic>.from(data as Map);
  }
}