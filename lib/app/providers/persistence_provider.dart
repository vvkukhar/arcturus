// lib/app/providers/persistence_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/store/store_persistence_manager.dart';

final storeBootstrapProvider = FutureProvider<void>((ref) async {
  final manager = StorePersistenceManager();
  await manager.bootstrap();
});
