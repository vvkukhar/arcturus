import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class FlowsEngineState {
  final List<Map<String, dynamic>> purchases;
  final List<Map<String, dynamic>> reprices;
  final List<Map<String, dynamic>> reviews;

  const FlowsEngineState({required this.purchases, required this.reprices, required this.reviews});

  FlowsEngineState copyWith({List<Map<String, dynamic>>? purchases, List<Map<String, dynamic>>? reprices, List<Map<String, dynamic>>? reviews}) {
    return FlowsEngineState(purchases: purchases ?? this.purchases, reprices: reprices ?? this.reprices, reviews: reviews ?? this.reviews);
  }
}

class FlowsEngine extends AsyncNotifier<FlowsEngineState> {
  @override
  Future<FlowsEngineState> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      if (event['type'] == 'flow_refresh') ref.invalidateSelf();
    });
    ref.onDispose(() => sub.cancel());

    final network = ref.read(networkCoreProvider);
    
    try {
      final pRes = await network.request('GET', '/flows/purchase');
      final repRes = await network.request('GET', '/flows/reprice');
      final revRes = await network.request('GET', '/flows/review');

      return FlowsEngineState(
        purchases: pRes is List ? List<Map<String, dynamic>>.from(pRes) : [],
        reprices: repRes is List ? List<Map<String, dynamic>>.from(repRes) : [],
        reviews: revRes is List ? List<Map<String, dynamic>>.from(revRes) : [],
      );
    } catch (e) {
      return const FlowsEngineState(purchases: [], reprices: [], reviews: []);
    }
  }

  Future<void> processAction(String flowType, String action, String id, [Map<String, dynamic>? extra]) async {
    final network = ref.read(networkCoreProvider);
    try {
      if (action == 'remove') {
        await network.request('DELETE', '/flows/$flowType', body: {'id': id});
      } else {
        await network.request('PATCH', '/flows/$flowType/$action', body: {'id': id, ...?extra});
      }
      ref.invalidateSelf();
    } catch (e) {
      throw Exception('Flow action failed: $e');
    }
  }
}

final flowsEngineProvider = AsyncNotifierProvider<FlowsEngine, FlowsEngineState>(FlowsEngine.new);