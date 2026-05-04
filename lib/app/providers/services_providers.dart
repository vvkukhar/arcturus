import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_persistence.dart';
import 'package:lego_trading_manager/app/providers/persistence_provider.dart';

class PersistenceFlushService {
  final AppPersistence _appPersistence;

  PersistenceFlushService(this._appPersistence);

  Future<void> flush() async {
    await _appPersistence.flushNow();
  }
}

final appPersistenceProvider = Provider<AppPersistence>((ref) {
  return AppPersistence(ref.read(storePersistenceManagerProvider));
});

final persistenceFlushServiceProvider = Provider<PersistenceFlushService>((ref) {
  return PersistenceFlushService(ref.read(appPersistenceProvider));
});