import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_risk_flag_model.dart';

final inventoryRiskFlagProvider =
    Provider.family<InventoryRiskFlagModel?, String>((ref, itemId) {
  final state = ref.watch(inventoryControllerProvider);
  final items = state.allItems;

  for (final item in items) {
    if (item.id != itemId) {
      continue;
    }

    final expectedProfit = (item.expectedSalePrice ?? 0) - item.totalCost;
    final purchaseDate = item.purchaseDate ?? DateTime.now();
    final daysHeld = DateTime.now().difference(purchaseDate).inDays;
    final lowProfit = expectedProfit <= 100;
    final highRisk = daysHeld >= 60 && expectedProfit <= 200;

    return InventoryRiskFlagModel(
      itemId: itemId,
      lowProfit: lowProfit,
      highRisk: highRisk,
      expectedProfit: expectedProfit,
      daysHeld: daysHeld,
    );
  }

  return null;
});