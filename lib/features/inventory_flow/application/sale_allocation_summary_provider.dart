import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_summary_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';

final saleAllocationSummaryProvider =
    Provider.family<SaleAllocationSummaryModel, SaleModel>((ref, sale) {
  final allocations = ref.watch(inventorySaleAllocationControllerProvider);
  final purchases = ref.watch(purchasesWithStockProvider);

  final saleAllocations = allocations.where((allocation) {
    return allocation.saleId == sale.id;
  }).toList();

  int allocatedQuantity = 0;
  double allocatedCost = 0;

  for (final allocation in saleAllocations) {
    allocatedQuantity += allocation.quantity;

    final matchingPurchases = purchases.where((purchase) {
      return purchase.id == allocation.purchaseId;
    });

    if (matchingPurchases.isEmpty) continue;

    final purchase = matchingPurchases.first;
    allocatedCost += purchase.unitCost * allocation.quantity;
  }

  return SaleAllocationSummaryModel(
    saleId: sale.id,
    allocatedQuantity: allocatedQuantity,
    allocatedCost: allocatedCost,
    hasAllocation: allocatedQuantity > 0,
  );
});