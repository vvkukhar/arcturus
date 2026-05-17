import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class SocketEventBus {
  final Ref _ref;
  final _debouncedEvents = <String, List<dynamic>>{};
  Timer? _debounceTimer;
  final _controller = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get events => _controller.stream;

  SocketEventBus(this._ref);

  void processRawEvent(Map<String, dynamic> event) {
    final syncState = _ref.read(syncEngineProvider).valueOrNull;
    if (syncState != null && syncState.pendingMutations > 0) return;

    final type = event['type'] as String;
    final payload = event['payload'];

    _debouncedEvents.putIfAbsent(type, () => []).add(payload);

    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(milliseconds: 350), () {
      final batched = Map<String, List<dynamic>>.from(_debouncedEvents);
      _debouncedEvents.clear();
      
      batched.forEach((key, payloads) {
        _controller.add({'type': key, 'payloads': payloads});
      });
    });
  }

  void dispose() {
    _debounceTimer?.cancel();
    _controller.close();
  }
}

final socketEventBusProvider = Provider<SocketEventBus>((ref) {
  final network = ref.watch(networkCoreProvider);
  final bus = SocketEventBus(ref);
  final sub = network.socketEvents.listen(bus.processRawEvent);
  ref.onDispose(() {
    sub.cancel();
    bus.dispose();
  });
  return bus;
});