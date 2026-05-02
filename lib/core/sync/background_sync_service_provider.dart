import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/core/sync/background_sync_service.dart';
import 'package:lego_trading_manager/core/sync/sync_queue_repository_provider.dart';

final backgroundSyncServiceProvider = Provider<BackgroundSyncService>((ref) {
  final queue = ref.watch(syncQueueRepositoryProvider);
  final api = ref.watch(apiClientProvider);
  return BackgroundSyncService(queue, api);
});
