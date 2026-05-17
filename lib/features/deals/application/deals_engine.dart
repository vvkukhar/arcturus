import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';

class DealEvaluation {
  final String id;
  final String action;
  final double score;
  final String reasonPrimary;
  final Map<String, dynamic> payload;
  final String verdict;
  final double marginPercent;
  final double expectedProfit;
  final double askingPrice;
  final String title;

  const DealEvaluation({
    required this.id,
    required this.action,
    required this.score,
    required this.reasonPrimary,
    required this.payload,
    required this.verdict,
    required this.marginPercent,
    required this.expectedProfit,
    required this.askingPrice,
    required this.title,
  });

  factory DealEvaluation.fromMap(Map<String, dynamic> map) {
    return DealEvaluation(
      id: map['id'] ?? '',
      action: map['action'] ?? 'SKIP',
      score: (map['score'] ?? 0).toDouble(),
      reasonPrimary: map['reasonPrimary'] ?? '',
      payload: map['payloadJson'] != null ? Map<String, dynamic>.from(map['payloadJson']) : {},
      verdict: map['verdict'] ?? 'neutral',
      marginPercent: (map['marginPercent'] ?? 0).toDouble(),
      expectedProfit: (map['expectedProfit'] ?? 0).toDouble(),
      askingPrice: (map['askingPrice'] ?? map['buyPrice'] ?? 0).toDouble(),
      title: map['title'] ?? 'Deal',
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

  DealEvaluation evaluate({required String title, required double askingPrice, required double marketPrice}) {
    final profit = marketPrice - askingPrice;
    return DealEvaluation(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      action: profit > 200 ? 'BUY' : 'SKIP',
      score: 85,
      reasonPrimary: 'Manual evaluation',
      payload: {},
      verdict: profit > 300 ? 'strong buy' : profit > 100 ? 'good' : 'weak',
      marginPercent: marketPrice > 0 ? (profit / marketPrice) * 100 : 0,
      expectedProfit: profit,
      askingPrice: askingPrice,
      title: title,
    );
  }

  Future<void> saveEvaluation(DealEvaluation eval) async {
    // Fake save for UI optimism
    final curr = state.valueOrNull ?? [];
    state = AsyncValue.data([eval, ...curr]);
  }

  Future<void> clearHistory() async {
    state = const AsyncValue.data([]);
  }
}

final dealsEngineProvider = AsyncNotifierProvider<DealsEngine, List<DealEvaluation>>(DealsEngine.new);