// lib/app/providers/app_bootstrap_runner_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/store/store_persistence_manager.dart';

class AppBootstrapRunner {
  Future<void> run() async {
    await StorePersistenceManager().bootstrap();
  }
}

final appBootstrapRunnerProvider = Provider<AppBootstrapRunner>((ref) {
  return AppBootstrapRunner();
});
