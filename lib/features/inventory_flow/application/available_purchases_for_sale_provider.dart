import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';

final availablePurchasesForSaleProvider =
    Provider.family<List<PurchaseModel>, SaleModel>((ref, sale) {
  final purchases = ref.watch(purchasesWithStockProvider);
  final allocations = ref.watch(inventorySaleAllocationControllerProvider);

  final currentSaleAllocations = allocations.where((allocation) {
    return allocation.saleId == sale.id;
  }).toList();

  final items = purchases.where((purchase) {
    if (purchase.itemId != sale.itemId) return false;

    final allocatedToCurrentSale = currentSaleAllocations
        .where((allocation) => allocation.purchaseId == purchase.id)
        .fold<int>(0, (sum, allocation) => sum + allocation.quantity);

    final effectiveRemaining =
        purchase.remainingQuantity + allocatedToCurrentSale;

    return effectiveRemaining > 0;
  }).map((purchase) {
    final allocatedToCurrentSale = currentSaleAllocations
        .where((allocation) => allocation.purchaseId == purchase.id)
        .fold<int>(0, (sum, allocation) => sum + allocation.quantity);

    return purchase.copyWith(
      soldQuantity: purchase.soldQuantity - allocatedToCurrentSale,
    );
  }).toList();

  items.sort((a, b) => a.purchaseDate.compareTo(b.purchaseDate));

  return items;
});