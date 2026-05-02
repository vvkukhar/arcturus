import 'package:lego_trading_manager/core/network/api_client.dart';
import 'package:lego_trading_manager/core/sync/sync_queue_repository.dart';

class BackgroundSyncService {
  final SyncQueueRepository _queueRepository;
  final ApiClient _apiClient;
  BackgroundSyncService(
    this._queueRepository,
    this._apiClient,
  );
  Future<void> flush() async {
    final items = await _queueRepository.getPending();
    for (final item in items) {
      final id = item['id'] as String;
      final endpoint = item['endpoint'] as String;
      final method = item['method'] as String;
      final body = Map<String, dynamic>.from(item['body'] as Map);
      final retryCount = (item['retryCount'] as int?) ?? 0;
      try {
        if (method == 'POST') {
          await _apiClient.post(endpoint, body: body);
        } else if (method == 'PATCH') {
          await _apiClient.patch(endpoint, body: body);
        } else {
          await _queueRepository.markFailed(id);
          continue;
        }
        await _queueRepository.markDone(id);
      } catch (_) {
        if (retryCount >= 3) {
          await _queueRepository.markFailed(id);
        } else {
          await _queueRepository.markRetry(id, retryCount + 1);
        }
      }
    }
  }
}
