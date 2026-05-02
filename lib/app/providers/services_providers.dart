// lib/app/providers/services_providers.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_persistence.dart';

class PersistenceFlushService {
  Future<void> flush() async {
    await AppPersistence.instance.flushNow();
  }
}

final persistenceFlushServiceProvider =
    Provider<PersistenceFlushService>((ref) {
  return PersistenceFlushService();
});
