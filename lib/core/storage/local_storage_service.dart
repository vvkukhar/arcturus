import 'package:lego_trading_manager/data/store/store_persistence_manager.dart';

class LocalStorageService {
  final StorePersistenceManager _manager = StorePersistenceManager();

  Future<void> loadAll() async {
    await _manager.bootstrap();
  }

  Future<void> saveAll() async {
    await _manager.persistAll();
  }

  Future<void> clearAll() async {
    await _manager.clearAll();
  }
}
