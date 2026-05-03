import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/store/store_persistence_manager.dart';

final storePersistenceManagerProvider = Provider<StorePersistenceManager>((ref) {
  return StorePersistenceManager(ref);
});

final storeBootstrapProvider = FutureProvider<void>((ref) async {
  await ref.read(storePersistenceManagerProvider).bootstrap();
});