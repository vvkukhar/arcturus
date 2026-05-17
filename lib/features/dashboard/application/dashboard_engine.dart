import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class DashboardAction {
  final String titleKey;
  final String subtitleKey;
  final String type;
  final Map<String, String>? titleArgs;
  final Map<String, String>? subArgs;
  
  const DashboardAction(this.titleKey, this.subtitleKey, this.type, {this.titleArgs, this.subArgs});
}

class DashboardEngineState {
  final double totalInvested;
  final double expectedOpenProfit;
  final int pendingOrders;
  final int activeListings;
  final List<DashboardAction> priorityQueue;
  final String headKey;
  final String subKey;
  final Map<String, String>? subArgs;
  final String currency;

  const DashboardEngineState({
    required this.totalInvested,
    required this.expectedOpenProfit,
    required this.pendingOrders,
    required this.activeListings,
    required this.priorityQueue,
    this.headKey = 'dash.head.stable',
    this.subKey = 'dash.sub.stats',
    this.subArgs,
    this.currency = 'UAH',
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
        queue.add(const DashboardAction('Ship Orders', 'orders need shipment', 'good'));
      }

      return DashboardEngineState(
        totalInvested: (snap['totalInventoryCost'] ?? 0).toDouble(),
        expectedOpenProfit: (snap['expectedInventoryProfit'] ?? 0).toDouble(),
        pendingOrders: exec['ordersPending'] ?? 0,
        activeListings: snap['activeInventoryItems'] ?? 0,
        priorityQueue: queue,
        headKey: 'dash.head.stable',
      );
    } catch (e) {
      return const DashboardEngineState(totalInvested: 0, expectedOpenProfit: 0, pendingOrders: 0, activeListings: 0, priorityQueue: []);
    }
  }
}

final dashboardEngineProvider = AsyncNotifierProvider<DashboardEngine, DashboardEngineState>(DashboardEngine.new);