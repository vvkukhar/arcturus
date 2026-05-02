import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_summary_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';

final inventoryStockSummaryProvider = Provider<InventoryStockSummaryModel>((ref) {
  final purchases = ref.watch(purchasesWithStockProvider);

  final totalPurchasedUnits = purchases.fold<int>(
    0,
    (sum, purchase) => sum + purchase.quantity,
  );

  final totalSoldUnits = purchases.fold<int>(
    0,
    (sum, purchase) => sum + purchase.soldQuantity,
  );

  final totalRemainingUnits = purchases.fold<int>(
    0,
    (sum, purchase) => sum + purchase.remainingQuantity,
  );

  final openPurchaseLots = purchases.where((purchase) {
    return purchase.remainingQuantity > 0;
  }).length;

  final fullySoldLots = purchases.where((purchase) {
    return purchase.isFullySold;
  }).length;

  return InventoryStockSummaryModel(
    totalPurchasedUnits: totalPurchasedUnits,
    totalSoldUnits: totalSoldUnits,
    totalRemainingUnits: totalRemainingUnits,
    openPurchaseLots: openPurchaseLots,
    fullySoldLots: fullySoldLots,
  );
});