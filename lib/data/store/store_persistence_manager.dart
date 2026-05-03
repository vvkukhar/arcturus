import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';

class StorePersistenceManager {
  final Ref ref;

  StorePersistenceManager(this.ref);

  Future<void> bootstrap() async {
    await ref.read(inventoryRepositoryProvider).loadCache();
    await ref.read(purchasesRepositoryProvider).loadCache();
    await ref.read(salesRepositoryProvider).loadCache();
    await ref.read(watchlistRepositoryProvider).loadCache();
    await ref.read(marketRepositoryProvider).loadCache();
    await ref.read(partOutRepositoryProvider).loadCache();
  }

  Future<void> persistAll() async {
    // Всі збереження тепер автоматично проходять атомарно в SQLite через Datasource.
    // Цей метод залишається пустим для сумісності з AppPersistence.
  }

  Future<void> clearAll() async {
    await ref.read(inventoryRepositoryProvider).replaceAll([]);
    await ref.read(purchasesRepositoryProvider).replaceAll([]);
    await ref.read(salesRepositoryProvider).replaceAll([]);
    await ref.read(watchlistRepositoryProvider).replaceAll([]);
    await ref.read(marketRepositoryProvider).replaceAll([]);
    await ref.read(partOutRepositoryProvider).replaceAll(projects: [], lines: []);
  }
}