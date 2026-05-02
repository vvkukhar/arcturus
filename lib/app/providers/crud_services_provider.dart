import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/services_providers.dart';

final persistenceFlushCrudProvider = Provider((ref) {
  return ref.read(persistenceFlushServiceProvider);
});
