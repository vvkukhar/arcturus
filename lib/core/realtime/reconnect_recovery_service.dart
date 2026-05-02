import 'dart:async';
import 'package:lego_trading_manager/core/network/connectivity_service.dart';
import 'package:lego_trading_manager/core/realtime/realtime_service.dart';

class ReconnectRecoveryService {
  final ConnectivityService _connectivityService;
  final RealtimeService _realtimeService;
  StreamSubscription<bool>? _subscription;
  ReconnectRecoveryService(
    this._connectivityService,
    this._realtimeService,
  );
  void start({
    required void Function() onRecovered,
  }) {
    _subscription?.cancel();
    _subscription = _connectivityService.onlineStream.listen((online) {
      if (online) {
        _realtimeService.disconnect();
        _realtimeService.connect();
        onRecovered();
      }
    });
  }

  void dispose() {
    _subscription?.cancel();
    _subscription = null;
  }
}
