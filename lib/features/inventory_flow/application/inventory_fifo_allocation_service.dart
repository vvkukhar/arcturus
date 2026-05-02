import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_fifo_allocation_result_model.dart';

class InventoryFifoAllocationService {
  const InventoryFifoAllocationService();

  InventoryFifoAllocationResultModel allocate({
    required SaleModel sale,
    required List<PurchaseModel> availablePurchases,
  }) {
    final requestedQuantity = sale.quantity;

    if (requestedQuantity <= 0) {
      return InventoryFifoAllocationResultModel(
        success: false,
        requestedQuantity: requestedQuantity,
        allocatedQuantity: 0,
        missingQuantity: requestedQuantity,
        allocations: const [],
        message: 'Sale quantity must be greater than zero.',
      );
    }

    final sortedLots = [...availablePurchases]
      ..sort((a, b) => a.purchaseDate.compareTo(b.purchaseDate));

    var remainingToAllocate = requestedQuantity;
    final allocations = <InventorySaleAllocationModel>[];

    for (final purchase in sortedLots) {
      if (remainingToAllocate <= 0) break;
      if (purchase.itemId != sale.itemId) continue;
      if (purchase.remainingQuantity <= 0) continue;

      final quantityFromLot = purchase.remainingQuantity >= remainingToAllocate
          ? remainingToAllocate
          : purchase.remainingQuantity;

      allocations.add(
        InventorySaleAllocationModel(
          saleId: sale.id,
          purchaseId: purchase.id,
          itemId: sale.itemId,
          quantity: quantityFromLot,
        ),
      );

      remainingToAllocate -= quantityFromLot;
    }

    final allocatedQuantity = allocations.fold<int>(
      0,
      (sum, allocation) => sum + allocation.quantity,
    );

    final success = allocatedQuantity == requestedQuantity;

    return InventoryFifoAllocationResultModel(
      success: success,
      requestedQuantity: requestedQuantity,
      allocatedQuantity: allocatedQuantity,
      missingQuantity: requestedQuantity - allocatedQuantity,
      allocations: allocations,
      message: success
          ? 'FIFO allocation completed.'
          : 'Not enough stock for full FIFO allocation.',
    );
  }
}