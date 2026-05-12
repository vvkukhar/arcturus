import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
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
    final prefs = await SharedPreferences.getInstance();
    
    Future<List<Map<String, dynamic>>> load(String key) async {
      final raw = prefs.getString('arcturus_flow_$key');
      if (raw == null || raw.isEmpty) return [];
      return List<Map<String, dynamic>>.from(jsonDecode(raw).map((e) => Map<String, dynamic>.from(e)));
    }

    return FlowsEngineState(purchases: await load('purchase'), reprices: await load('reprice'), reviews: await load('review'));
  }

  Future<void> processAction(String flowType, String action, String id, [Map<String, dynamic>? extra]) async {
    if (state.value == null) return;
    final curr = state.value!;
    
    List<Map<String, dynamic>> list = List.from(flowType == 'purchase' ? curr.purchases : flowType == 'reprice' ? curr.reprices : curr.reviews);

    if (action == 'remove') {
      list.removeWhere((e) => e['id'] == id);
    } else {
      final idx = list.indexWhere((e) => e['id'] == id);
      if (idx != -1) {
        final status = flowType == 'purchase' ? 'bought' : flowType == 'reprice' ? 'listed' : 'reviewed';
        list[idx] = {...list[idx], 'status': status};
      }
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('arcturus_flow_$flowType', jsonEncode(list));

    state = AsyncValue.data(flowType == 'purchase' ? curr.copyWith(purchases: list) : flowType == 'reprice' ? curr.copyWith(reprices: list) : curr.copyWith(reviews: list));

    ref.read(syncEngineProvider.notifier).enqueueMutation('${flowType}_flow', '/flows/$flowType/$action', 'PATCH', {'id': id, ...?extra});
  }
}

final flowsEngineProvider = AsyncNotifierProvider<FlowsEngine, FlowsEngineState>(FlowsEngine.new);