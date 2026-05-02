import 'package:lego_trading_manager/core/network/api_client.dart';

class OperatorApiRepository {
  final ApiClient _apiClient;

  OperatorApiRepository(this._apiClient);

  Future<Map<String, dynamic>> getHealth() async {
    final data = await _apiClient.get('/operator/health');
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> createInventory({
    required String itemId,
    required double purchasePrice,
    required int quantity,
    required bool sealed,
  }) async {
    final data = await _apiClient.post(
      '/operator/inventory/create',
      body: {
        'itemId': itemId,
        'purchasePrice': purchasePrice,
        'quantity': quantity,
        'sealed': sealed,
      },
    );
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> createWatchlist({
    required String title,
    String? setNumber,
    String? theme,
    int? year,
  }) async {
    final data = await _apiClient.post(
      '/operator/watchlist/create',
      body: {
        'title': title,
        'setNumber': setNumber,
        'theme': theme,
        'year': year,
      },
    );
    return Map<String, dynamic>.from(data as Map);
  }

  Future<List<Map<String, dynamic>>> getUnresolvedMatches({
    String status = 'pending',
    int limit = 50,
  }) async {
    final data = await _apiClient.get(
      '/operator/unresolved-matches?status=$status&limit=$limit',
    );
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<Map<String, dynamic>> getUnresolvedSummary() async {
    final data = await _apiClient.get('/operator/unresolved-summary');
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> resolveMatch({
    required String queueId,
    required String itemId,
    String? operatorNote,
  }) async {
    final data = await _apiClient.patch(
      '/operator/resolve-match',
      body: {
        'queueId': queueId,
        'itemId': itemId,
        'operatorNote': operatorNote,
      },
    );
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> dismissMatch({
    required String queueId,
    String? operatorNote,
  }) async {
    final data = await _apiClient.patch(
      '/operator/dismiss-match',
      body: {
        'queueId': queueId,
        'operatorNote': operatorNote,
      },
    );
    return Map<String, dynamic>.from(data as Map);
  }

  Future<Map<String, dynamic>> updateNote({
    required String queueId,
    required String operatorNote,
  }) async {
    final data = await _apiClient.patch(
      '/operator/update-note',
      body: {
        'queueId': queueId,
        'operatorNote': operatorNote,
      },
    );
    return Map<String, dynamic>.from(data as Map);
  }

  Future<List<Map<String, dynamic>>> getSourceRunHistory({
    int limit = 30,
  }) async {
    final data = await _apiClient.get('/source-health/runs?limit=$limit');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<Map<String, dynamic>?> getSourceRunDetails(String runId) async {
    final data = await _apiClient.get('/source-health/runs/$runId');
    if (data == null) return null;
    return Map<String, dynamic>.from(data as Map);
  }

  Future<List<Map<String, dynamic>>> getSyncErrors({
    int limit = 50,
    String? sourceCode,
  }) async {
    final suffix = sourceCode == null || sourceCode.isEmpty
        ? ''
        : '&sourceCode=${Uri.encodeQueryComponent(sourceCode)}';
    final data =
        await _apiClient.get('/source-health/errors?limit=$limit$suffix');
    return (data as List)
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }
}