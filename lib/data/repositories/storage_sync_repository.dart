// lib/data/repositories/storage_sync_repository.dart

import 'package:lego_trading_manager/data/store/store_persistence_manager.dart';

class StorageSyncRepository {
  final StorePersistenceManager manager;

  StorageSyncRepository(this.manager);

  Future<void> saveAll() => manager.persistAll();

  Future<void> clearAll() => manager.clearAll();
}
