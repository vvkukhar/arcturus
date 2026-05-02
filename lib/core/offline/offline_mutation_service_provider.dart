import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/core/network/connectivity_service_provider.dart';
import 'package:lego_trading_manager/core/offline/offline_mutation_service.dart';
import 'package:lego_trading_manager/core/sync/sync_queue_repository_provider.dart';

final offlineMutationServiceProvider = Provider<OfflineMutationService>((ref) {
  final connectivity = ref.watch(connectivityServiceProvider);
  final queue = ref.watch(syncQueueRepositoryProvider);
  final api = ref.watch(apiClientProvider);
  return OfflineMutationService(connectivity, queue, api);
});
