import 'package:uuid/uuid.dart';
import 'package:lego_trading_manager/core/network/connectivity_service.dart';
import 'package:lego_trading_manager/core/network/api_client.dart';
import 'package:lego_trading_manager/core/offline/offline_write_result.dart';
import 'package:lego_trading_manager/core/sync/sync_queue_repository.dart';

class OfflineMutationService {
  final ConnectivityService _connectivityService;
  final SyncQueueRepository _syncQueueRepository;
  final ApiClient _apiClient;
  final Uuid _uuid = const Uuid();
  OfflineMutationService(
    this._connectivityService,
    this._syncQueueRepository,
    this._apiClient,
  );
  Future<OfflineWriteResult> run({
    required String queueType,
    required String endpoint,
    required String method,
    required Map<String, dynamic> body,
  }) async {
    final online = await _connectivityService.isOnline();
    if (!online) {
      await _syncQueueRepository.enqueue(
        id: _uuid.v4(),
        queueType: queueType,
        endpoint: endpoint,
        method: method,
        body: body,
      );
      return const OfflineWriteResult(
        queuedOffline: true,
        completedOnline: false,
      );
    }
    if (method == 'POST') {
      await _apiClient.post(endpoint, body: body);
    } else if (method == 'PATCH') {
      await _apiClient.patch(endpoint, body: body);
    } else {
      throw Exception('Unsupported method: $method');
    }
    return const OfflineWriteResult(
      queuedOffline: false,
      completedOnline: true,
    );
  }
}
