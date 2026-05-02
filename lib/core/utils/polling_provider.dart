import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class PollingController {
  final Duration interval;
  Timer? _timer;

  PollingController({
    required this.interval,
  });

  void start(void Function() onTick) {
    stop();
    _timer = Timer.periodic(interval, (_) => onTick());
  }

  void stop() {
    _timer?.cancel();
    _timer = null;
  }
}

final pollingControllerProvider = Provider<PollingController>((ref) {
  final controller = PollingController(interval: const Duration(seconds: 15));
  ref.onDispose(controller.stop);
  return controller;
});
