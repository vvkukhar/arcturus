import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/storage_sync_repository.dart';
import 'package:lego_trading_manager/data/store/store_persistence_manager.dart';

final storageSyncRepositoryProvider = Provider<StorageSyncRepository>((ref) {
  return StorageSyncRepository(StorePersistenceManager(ref));
});