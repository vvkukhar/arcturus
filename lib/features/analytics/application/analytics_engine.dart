import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';

class AnalyticsEngineState {
  final double netProfit;
  final double grossRevenue;
  final double totalInvested;
  final double inventoryValue;
  final int activeItemsCount;
  final int salesCount;

  const AnalyticsEngineState({
    required this.netProfit,
    required this.grossRevenue,
    required this.totalInvested,
    required this.inventoryValue,
    required this.activeItemsCount,
    required this.salesCount,
  });

  factory AnalyticsEngineState.fromMap(Map<String, dynamic> map) {
    return AnalyticsEngineState(
      netProfit: (map['netProfit'] ?? 0).toDouble(),
      grossRevenue: (map['grossRevenue'] ?? 0).toDouble(),
      totalInvested: (map['totalInventoryCost'] ?? 0).toDouble(),
      inventoryValue: (map['expectedInventoryValue'] ?? 0).toDouble(),
      activeItemsCount: map['activeInventoryItems'] ?? 0,
      salesCount: map['salesCount'] ?? 0,
    );
  }
}

class AnalyticsEngine extends AsyncNotifier<AnalyticsEngineState> {
  @override
  Future<AnalyticsEngineState> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      if (['sale_registered', 'inventory_updated'].contains(event['type'])) {
        ref.invalidateSelf();
      }
    });
    ref.onDispose(() => sub.cancel());

    final network = ref.read(networkCoreProvider);
    try {
      final response = await network.request('GET', '/dashboard/business-snapshot');
      return AnalyticsEngineState.fromMap(Map<String, dynamic>.from(response));
    } catch (e) {
      throw Exception('Failed to load analytics: $e');
    }
  }
}

final analyticsEngineProvider = AsyncNotifierProvider<AnalyticsEngine, AnalyticsEngineState>(AnalyticsEngine.new);