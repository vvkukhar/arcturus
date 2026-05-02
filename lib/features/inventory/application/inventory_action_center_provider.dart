import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_trade_decision_provider.dart';

class InventoryActionCenterModel {
  final int buy;
  final int sell;
  final int reprice;
  final int review;
  final int hold;
  final String topLabel;

  const InventoryActionCenterModel({
    required this.buy,
    required this.sell,
    required this.reprice,
    required this.review,
    required this.hold,
    required this.topLabel,
  });
}

final inventoryActionCenterProvider =
    Provider<InventoryActionCenterModel>((ref) {
  final decisions = ref.watch(inventoryTradeDecisionProvider);
  int buy = 0;
  int sell = 0;
  int reprice = 0;
  int review = 0;
  int hold = 0;
  for (final item in decisions) {
    switch (item.decision) {
      case InventoryTradeDecisionType.buy:
        buy++;
        break;
      case InventoryTradeDecisionType.sell:
        sell++;
        break;
      case InventoryTradeDecisionType.reprice:
        reprice++;
        break;
      case InventoryTradeDecisionType.review:
        review++;
        break;
      case InventoryTradeDecisionType.hold:
        hold++;
        break;
    }
  }
  final top = <String, int>{
    'Buy': buy,
    'Sell': sell,
    'Reprice': reprice,
    'Review': review,
    'Hold': hold,
  }.entries.toList()
    ..sort((a, b) => b.value.compareTo(a.value));
  final topLabel =
      top.isEmpty ? 'No actions' : '${top.first.key} ${top.first.value}';
  return InventoryActionCenterModel(
    buy: buy,
    sell: sell,
    reprice: reprice,
    review: review,
    hold: hold,
    topLabel: topLabel,
  );
});
