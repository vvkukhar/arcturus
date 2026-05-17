import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class DashboardAction {
  final String title;
  final String subtitle;
  final String type;
  
  const DashboardAction(this.title, this.subtitle, this.type);
}

class DashboardEngineState {
  final double totalInvested;
  final double expectedProfit;
  final int pendingOrders;
  final int activeListings;
  final List<DashboardAction> priorityQueue;

  const DashboardEngineState({
    required this.totalInvested,
    required this.expectedProfit,
    required this.pendingOrders,
    required this.activeListings,
    required this.priorityQueue,
  });
}

class DashboardEngine extends AsyncNotifier<DashboardEngineState> {
  @override
  Future<DashboardEngineState> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      if (event['type'] == 'dashboard_refresh') ref.invalidateSelf();
    });
    ref.onDispose(() => sub.cancel());

    final network = ref.read(networkCoreProvider);
    try {
      final snap = await network.request('GET', '/dashboard/business-snapshot');
      final exec = await network.request('GET', '/dashboard/execution-summary');
      
      final queue = <DashboardAction>[];
      if (exec['ordersPending'] > 0) {
        queue.add(DashboardAction('Ship Orders', '${exec['ordersPending']} orders need shipment', 'good'));
      }
      if (exec['repricePending'] > 0) {
        queue.add(DashboardAction('Reprice Items', '${exec['repricePending']} items need pricing update', 'danger'));
      }

      return DashboardEngineState(
        totalInvested: (snap['totalInventoryCost'] ?? 0).toDouble(),
        expectedProfit: (snap['expectedInventoryProfit'] ?? 0).toDouble(),
        pendingOrders: exec['ordersPending'] ?? 0,
        activeListings: snap['activeInventoryItems'] ?? 0,
        priorityQueue: queue,
      );
    } catch (e) {
      return const DashboardEngineState(totalInvested: 0, expectedProfit: 0, pendingOrders: 0, activeListings: 0, priorityQueue: []);
    }
  }
}

final dashboardEngineProvider = AsyncNotifierProvider<DashboardEngine, DashboardEngineState>(DashboardEngine.new);