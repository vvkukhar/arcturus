import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

class OrdersEngine extends AsyncNotifier<List<dynamic>> {
  @override
  Future<List<dynamic>> build() async {
    return _fetchData();
  }

  Future<List<dynamic>> _fetchData() async {
    final repo = ref.read(ordersRepositoryProvider);
    try {
      final res = await repo.network.request('GET', '/orders?limit=100');
      return res is List ? res : [];
    } catch (e) {
      return [];
    }
  }

  Future<void> generateTtn(List<String> orderIds) async {
    final repo = ref.read(ordersRepositoryProvider);
    await repo.network.request('POST', '/orders/bulk-ttn', body: {'orderIds': orderIds});
    ref.invalidateSelf();
  }

  Future<String?> generatePdf(List<String> orderIds) async {
    final repo = ref.read(ordersRepositoryProvider);
    final res = await repo.network.request('POST', '/orders/bulk-pdf', body: {'orderIds': orderIds});
    if (res is Map && res['url'] != null) {
      return res['url'].toString();
    }
    return null;
  }
}

final ordersEngineProvider = AsyncNotifierProvider<OrdersEngine, List<dynamic>>(OrdersEngine.new);