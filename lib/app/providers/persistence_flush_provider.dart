import 'package:flutter_riverpod/flutter_riverpod.dart';

class PersistenceFlushService {
  Future<void> flush() async {}
}

final persistenceFlushServiceProvider =
    Provider<PersistenceFlushService>((ref) {
  return PersistenceFlushService();
});
