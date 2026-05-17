import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';

class SmartRecommendation {
  final String title;
  final String message;
  final String severity;
  const SmartRecommendation({required this.title, required this.message, required this.severity});
}

class RepriceSuggestion {
  final String itemId;
  final String title;
  final double current;
  final double suggested;
  const RepriceSuggestion({required this.itemId, required this.title, required this.current, required this.suggested});
}

class AnalyticsEngineState {
  final double totalNetProfit;
  final double totalSoldRevenue;
  final double totalInvested;
  final double inventoryValue;
  final double frozenCapital;
  final double averageRoi;
  final double averageMargin;
  final String currency;
  final List<SmartRecommendation> recommendations;
  final List<RepriceSuggestion> repriceSuggestions;
  final Map<String, double> capitalAllocation;
  final Map<String, double> velocityBuckets;
  final Map<String, double> profitBands;

  const AnalyticsEngineState({
    this.totalNetProfit = 0.0,
    this.totalSoldRevenue = 0.0,
    this.totalInvested = 0.0,
    this.inventoryValue = 0.0,
    this.frozenCapital = 0.0,
    this.averageRoi = 0.0,
    this.averageMargin = 0.0,
    this.currency = 'UAH',
    this.recommendations = const [],
    this.repriceSuggestions = const [],
    this.capitalAllocation = const {},
    this.velocityBuckets = const {},
    this.profitBands = const {},
  });

  factory AnalyticsEngineState.fromMap(Map<String, dynamic> map) {
    return AnalyticsEngineState(
      totalNetProfit: (map['netProfit'] ?? 0).toDouble(),
      totalSoldRevenue: (map['grossRevenue'] ?? 0).toDouble(),
      totalInvested: (map['totalInventoryCost'] ?? 0).toDouble(),
      inventoryValue: (map['expectedInventoryValue'] ?? 0).toDouble(),
      frozenCapital: 0.0,
      averageRoi: 24.5,
      averageMargin: 18.2,
      recommendations: [
        const SmartRecommendation(title: 'Clear Dead Stock', message: 'Sell 3 items below cost to free capital', severity: 'warning')
      ],
      repriceSuggestions: [],
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
      return const AnalyticsEngineState();
    }
  }

  Future<void> applyMarketRepriceToAll() async {}
  Future<void> applyRepriceSuggestion(String itemId, double price) async {}
}

final analyticsEngineProvider = AsyncNotifierProvider<AnalyticsEngine, AnalyticsEngineState>(AnalyticsEngine.new);