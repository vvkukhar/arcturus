import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_database_provider.dart';
import 'package:lego_trading_manager/core/sync/sync_queue_repository.dart';

final syncQueueRepositoryProvider = Provider<SyncQueueRepository>((ref) {
  final database = ref.watch(appDatabaseProvider);
  return SyncQueueRepository(database);
});
