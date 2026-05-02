import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';

final purchasesWithStockProvider = Provider<List<PurchaseModel>>((ref) {
  final purchases = ref.watch(purchasesControllerProvider);
  final allocations = ref.watch(inventorySaleAllocationControllerProvider);

  return purchases.map((purchase) {
    final allocatedSoldQuantity = allocations
        .where((allocation) => allocation.purchaseId == purchase.id)
        .fold<int>(
          0,
          (sum, allocation) => sum + allocation.quantity,
        );

    return purchase.copyWith(
      soldQuantity: allocatedSoldQuantity,
    );
  }).toList();
});