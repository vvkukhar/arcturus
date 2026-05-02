import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_model.dart';

class InventorySaleAllocationService {
  const InventorySaleAllocationService();

  int soldQuantityForPurchase({
    required String purchaseId,
    required List<InventorySaleAllocationModel> allocations,
  }) {
    return allocations
        .where((allocation) => allocation.purchaseId == purchaseId)
        .fold<int>(
          0,
          (sum, allocation) => sum + allocation.quantity,
        );
  }

  PurchaseModel applySoldQuantity({
    required PurchaseModel purchase,
    required List<InventorySaleAllocationModel> allocations,
  }) {
    final soldQuantity = soldQuantityForPurchase(
      purchaseId: purchase.id,
      allocations: allocations,
    );

    return purchase.copyWith(
      soldQuantity: soldQuantity,
    );
  }

  List<PurchaseModel> applySoldQuantities({
    required List<PurchaseModel> purchases,
    required List<InventorySaleAllocationModel> allocations,
  }) {
    return purchases.map((purchase) {
      return applySoldQuantity(
        purchase: purchase,
        allocations: allocations,
      );
    }).toList();
  }

  bool canAllocate({
    required PurchaseModel purchase,
    required int quantity,
  }) {
    if (quantity <= 0) return false;
    return purchase.remainingQuantity >= quantity;
  }
}