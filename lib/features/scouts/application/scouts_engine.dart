import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

class ScoutsEngine extends AsyncNotifier<List<dynamic>> {
  @override
  Future<List<dynamic>> build() async {
    return _fetchData();
  }

  Future<List<dynamic>> _fetchData() async {
    final repo = ref.read(scoutsRepositoryProvider);
    try {
      final res = await repo.network.request('GET', '/scout/leads');
      return res is List ? res : [];
    } catch (e) {
      return [];
    }
  }

  Future<void> reward(String id, double amount) async {
    final repo = ref.read(scoutsRepositoryProvider);
    await repo.network.request('PATCH', '/scout/reward/$id', body: {'rewardAmount': amount});
    ref.invalidateSelf();
  }

  Future<void> reject(String id, String note) async {
    final repo = ref.read(scoutsRepositoryProvider);
    await repo.network.request('PATCH', '/scout/reject/$id', body: {'adminNote': note});
    ref.invalidateSelf();
  }
}

final scoutsEngineProvider = AsyncNotifierProvider<ScoutsEngine, List<dynamic>>(ScoutsEngine.new);