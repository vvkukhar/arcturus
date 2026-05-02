import 'package:lego_trading_manager/data/repositories/storage_sync_repository.dart';

class PersistenceFlushService {
  final StorageSyncRepository repository;

  PersistenceFlushService(this.repository);

  Future<void> flush() {
    return repository.saveAll();
  }
}
