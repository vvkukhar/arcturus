import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_trade_decision_provider.dart';

class InventoryTopSellCandidateModel {
  final String itemId;
  final String title;
  final double score;
  final String reason;

  const InventoryTopSellCandidateModel({
    required this.itemId,
    required this.title,
    required this.score,
    required this.reason,
  });
}

final inventoryTopSellCandidatesProvider =
    Provider<List<InventoryTopSellCandidateModel>>((ref) {
  final decisions = ref.watch(inventoryTradeDecisionProvider);
  final result = decisions
      .where((e) => e.decision == InventoryTradeDecisionType.sell)
      .map(
        (e) => InventoryTopSellCandidateModel(
          itemId: e.itemId,
          title: e.title,
          score: e.score,
          reason: e.reason,
        ),
      )
      .toList();
  result.sort((a, b) => b.score.compareTo(a.score));
  return result.take(10).toList();
});
