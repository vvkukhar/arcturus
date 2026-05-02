import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_score_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';

final deadStockScoreProvider = Provider<List<DeadStockScoreModel>>((ref) {
  final items = ref.watch(inventoryControllerProvider).allItems;

  final scored = items.where((item) => item.isActive).map((item) {
    final days = item.daysInInventory ?? 0;
    final capital = item.totalCost;
    final expectedProfit = (item.expectedSalePrice ?? 0) - item.totalCost;
    final score = (days * 1.0) + (capital / 100.0) - (expectedProfit / 100.0);

    return DeadStockScoreModel(
      itemId: item.id,
      title: item.title,
      days: days,
      capital: capital,
      expectedProfit: expectedProfit,
      score: score,
    );
  }).toList();

  scored.sort((a, b) => b.score.compareTo(a.score));
  return scored;
});
