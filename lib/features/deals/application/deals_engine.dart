import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';

class DealEvaluation {
  final String id;
  final String action;
  final double score;
  final String reasonPrimary;
  final Map<String, dynamic> payload;

  const DealEvaluation({
    required this.id,
    required this.action,
    required this.score,
    required this.reasonPrimary,
    required this.payload,
  });

  factory DealEvaluation.fromMap(Map<String, dynamic> map) {
    return DealEvaluation(
      id: map['id'],
      action: map['action'],
      score: (map['score'] ?? 0).toDouble(),
      reasonPrimary: map['reasonPrimary'] ?? '',
      payload: map['payloadJson'] != null ? Map<String, dynamic>.from(map['payloadJson']) : {},
    );
  }
}

class DealsEngine extends AsyncNotifier<List<DealEvaluation>> {
  @override
  Future<List<DealEvaluation>> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      if (event['type'] == 'decision.executed' || event['type'] == 'decision.buy_evaluated') {
        ref.invalidateSelf();
      }
    });
    ref.onDispose(() => sub.cancel());

    final network = ref.read(networkCoreProvider);
    try {
      final response = await network.request('GET', '/decision-engine/latest?limit=50');
      if (response is List) {
        return response.map((e) => DealEvaluation.fromMap(Map<String, dynamic>.from(e))).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<DealEvaluation> evaluateLocal(String itemId, double buyPrice, double targetSellPrice) async {
    final network = ref.read(networkCoreProvider);
    try {
      final response = await network.request('POST', '/decision-engine/buy', body: {
        'itemId': itemId,
        'buyPrice': buyPrice,
        'targetSellPrice': targetSellPrice,
      });
      ref.invalidateSelf();
      return DealEvaluation.fromMap(Map<String, dynamic>.from(response));
    } catch (e) {
      throw Exception('Failed to evaluate deal: $e');
    }
  }
}

final dealsEngineProvider = AsyncNotifierProvider<DealsEngine, List<DealEvaluation>>(DealsEngine.new);