import 'package:lego_trading_manager/core/services/persistence_flush_service.dart';

class CrudFlushService {
  final PersistenceFlushService persistenceFlushService;

  CrudFlushService(this.persistenceFlushService);

  Future<void> flush() {
    return persistenceFlushService.flush();
  }
}
