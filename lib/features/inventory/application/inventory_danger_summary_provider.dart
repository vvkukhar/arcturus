import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_danger_summary_model.dart';

final inventoryDangerSummaryProvider =
    Provider<InventoryDangerSummaryModel>((ref) {
  final state = ref.watch(inventoryControllerProvider);
  final items = state.allItems;

  int lowProfitCount = 0;
  int highRiskCount = 0;
  int bothCount = 0;

  for (final item in items) {
    final expectedProfit = (item.expectedSalePrice ?? 0) - item.totalCost;
    final purchaseDate = item.purchaseDate ?? DateTime.now();
    final daysHeld = DateTime.now().difference(purchaseDate).inDays;
    final lowProfit = expectedProfit <= 100;
    final highRisk = daysHeld >= 60 && expectedProfit <= 200;

    if (lowProfit) {
      lowProfitCount++;
    }
    if (highRisk) {
      highRiskCount++;
    }
    if (lowProfit && highRisk) {
      bothCount++;
    }
  }

  return InventoryDangerSummaryModel(
    lowProfitCount: lowProfitCount,
    highRiskCount: highRiskCount,
    bothCount: bothCount,
  );
});