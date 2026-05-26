import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

class MonetizationEngine extends AsyncNotifier<List<dynamic>> {
  @override
  Future<List<dynamic>> build() async {
    return _fetchData();
  }

  Future<List<dynamic>> _fetchData() async {
    final repo = ref.read(monetizationRepositoryProvider);
    try {
      final res = await repo.network.request('GET', '/monetization/mystery-boxes');
      return res is List ? res : [];
    } catch (e) {
      return [];
    }
  }

  Future<void> generateBoxes() async {
    final repo = ref.read(monetizationRepositoryProvider);
    await repo.network.request('POST', '/monetization/mystery-boxes/generate');
    ref.invalidateSelf();
  }
}

final monetizationEngineProvider = AsyncNotifierProvider<MonetizationEngine, List<dynamic>>(MonetizationEngine.new);