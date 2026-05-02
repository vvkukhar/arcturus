import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_health_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_value_provider.dart';

final inventoryStockHealthProvider = Provider<InventoryStockHealthModel>((ref) {
  final summary = ref.watch(inventoryStockSummaryProvider);
  final value = ref.watch(inventoryStockValueProvider);

  double score = 100;

  if (summary.totalPurchasedUnits == 0) {
    score = 0;
  }

  final remainingRatio = summary.totalPurchasedUnits == 0
      ? 0
      : summary.totalRemainingUnits / summary.totalPurchasedUnits;

  if (remainingRatio > 0.8 && summary.totalPurchasedUnits >= 5) {
    score -= 20;
  }

  if (summary.totalSoldUnits == 0 && summary.totalPurchasedUnits >= 3) {
    score -= 25;
  }

  if (value.remainingCostValue > value.soldCostValue &&
      summary.totalSoldUnits > 0) {
    score -= 10;
  }

  if (score < 0) score = 0;

  final label = score >= 80
      ? 'healthy stock'
      : score >= 55
          ? 'stock needs attention'
          : 'weak stock flow';

  final explanation = score >= 80
      ? 'Stock movement looks balanced.'
      : score >= 55
          ? 'Some capital may be locked in unsold inventory.'
          : 'Inventory flow needs cleanup: too many unsold units or weak movement.';

  return InventoryStockHealthModel(
    score: score,
    label: label,
    explanation: explanation,
  );
});