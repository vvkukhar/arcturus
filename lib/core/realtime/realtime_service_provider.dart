import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/realtime/realtime_service.dart';

final realtimeServiceProvider = Provider<RealtimeService>((ref) {
  final service = RealtimeService();
  ref.onDispose(service.dispose);
  return service;
});
