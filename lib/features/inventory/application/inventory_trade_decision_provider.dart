import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';

enum InventoryTradeDecisionType {
  buy,
  hold,
  sell,
  reprice,
  review,
}

class InventoryTradeDecisionItemModel {
  final String itemId;
  final String title;
  final InventoryTradeDecisionType decision;
  final String reason;
  final double score;

  const InventoryTradeDecisionItemModel({
    required this.itemId,
    required this.title,
    required this.decision,
    required this.reason,
    required this.score,
  });
}

final inventoryTradeDecisionProvider =
    Provider<List<InventoryTradeDecisionItemModel>>((ref) {
  final state = ref.watch(inventoryControllerProvider);
  final items = state.allItems;
  final result = <InventoryTradeDecisionItemModel>[];

  for (final item in items) {
    final expectedSale = item.expectedSalePrice ?? 0;
    final marketAverage = item.marketAverage ?? expectedSale;
    final cost = item.totalCost;
    final expectedProfit = expectedSale - cost;
    final marketGap = marketAverage - expectedSale;
    final heldDays = item.purchaseDate == null
        ? 0
        : DateTime.now().difference(item.purchaseDate!).inDays;

    late InventoryTradeDecisionType decision;
    late String reason;
    late double score;

    if (expectedProfit <= 50 && heldDays >= 45) {
      decision = InventoryTradeDecisionType.review;
      reason = 'Low profit and old stock';
      score = 90;
    } else if (marketGap >= 20) {
      decision = InventoryTradeDecisionType.reprice;
      reason = 'Market average is above expected sale';
      score = 82;
    } else if (expectedProfit >= 250 && heldDays <= 21) {
      decision = InventoryTradeDecisionType.sell;
      reason = 'Strong margin already available';
      score = 78;
    } else if (expectedProfit >= 120) {
      decision = InventoryTradeDecisionType.hold;
      reason = 'Position is healthy';
      score = 58;
    } else {
      decision = InventoryTradeDecisionType.review;
      reason = 'Needs manual review';
      score = 50;
    }

    result.add(
      InventoryTradeDecisionItemModel(
        itemId: item.id,
        title: item.title,
        decision: decision,
        reason: reason,
        score: score,
      ),
    );
  }

  result.sort((a, b) => b.score.compareTo(a.score));
  return result;
});