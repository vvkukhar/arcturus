import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_stock_value_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';

final inventoryStockValueProvider = Provider<InventoryStockValueModel>((ref) {
  final purchases = ref.watch(purchasesWithStockProvider);

  int remainingUnits = 0;
  double remainingCostValue = 0;
  double soldCostValue = 0;
  double totalCostValue = 0;

  for (final purchase in purchases) {
    remainingUnits += purchase.remainingQuantity;
    remainingCostValue += purchase.unitCost * purchase.remainingQuantity;
    soldCostValue += purchase.unitCost * purchase.soldQuantity;
    totalCostValue += purchase.finalTotal;
  }

  return InventoryStockValueModel(
    remainingUnits: remainingUnits,
    remainingCostValue: remainingCostValue,
    soldCostValue: soldCostValue,
    totalCostValue: totalCostValue,
  );
});