import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/connectivity_service_provider.dart';
import 'package:lego_trading_manager/core/realtime/realtime_service_provider.dart';
import 'package:lego_trading_manager/core/realtime/reconnect_recovery_service.dart';

final reconnectRecoveryServiceProvider =
    Provider<ReconnectRecoveryService>((ref) {
  final connectivity = ref.watch(connectivityServiceProvider);
  final realtime = ref.watch(realtimeServiceProvider);
  final service = ReconnectRecoveryService(connectivity, realtime);
  ref.onDispose(service.dispose);
  return service;
});
