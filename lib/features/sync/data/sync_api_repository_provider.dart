import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/sync/data/sync_api_repository.dart';

final syncApiRepositoryProvider = Provider<SyncApiRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return SyncApiRepository(apiClient);
});