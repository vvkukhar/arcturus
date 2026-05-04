import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/persistence_provider.dart';

class LocalStorageService {
  final Ref ref;

  LocalStorageService(this.ref);

  Future<void> loadAll() async {
    await ref.read(storePersistenceManagerProvider).bootstrap();
  }

  Future<void> saveAll() async {
    await ref.read(storePersistenceManagerProvider).persistAll();
  }

  Future<void> clearAll() async {
    await ref.read(storePersistenceManagerProvider).clearAll();
  }
}