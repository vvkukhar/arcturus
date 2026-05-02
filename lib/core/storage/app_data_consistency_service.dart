import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_model.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_model.dart';

class AppDataConsistencyResult {
  final List<InventorySaleAllocationModel> allocations;
  final List<SalePurchaseLinkModel> salePurchaseLinks;
  final int removedAllocations;
  final int removedLinks;
  final int adjustedAllocations;

  const AppDataConsistencyResult({
    required this.allocations,
    required this.salePurchaseLinks,
    required this.removedAllocations,
    required this.removedLinks,
    required this.adjustedAllocations,
  });
}

class AppDataConsistencyService {
  const AppDataConsistencyService();

  AppDataConsistencyResult cleanup({
    required List<PurchaseModel> purchases,
    required List<SaleModel> sales,
    required List<InventorySaleAllocationModel> allocations,
    required List<SalePurchaseLinkModel> salePurchaseLinks,
  }) {
    final purchaseIds = purchases.map((purchase) => purchase.id).toSet();
    final saleIds = sales.map((sale) => sale.id).toSet();

    final purchaseById = {
      for (final purchase in purchases) purchase.id: purchase,
    };

    final saleById = {
      for (final sale in sales) sale.id: sale,
    };

    final relationCleanedAllocations = allocations.where((allocation) {
      return saleIds.contains(allocation.saleId) &&
          purchaseIds.contains(allocation.purchaseId) &&
          allocation.quantity > 0;
    }).toList();

    final cleanedLinks = salePurchaseLinks.where((link) {
      return saleIds.contains(link.saleId) &&
          purchaseIds.contains(link.purchaseId);
    }).toList();

    final adjusted = <InventorySaleAllocationModel>[];
    final saleAllocated = <String, int>{};
    final purchaseAllocated = <String, int>{};
    var adjustedCount = 0;

    for (final allocation in relationCleanedAllocations) {
      final sale = saleById[allocation.saleId];
      final purchase = purchaseById[allocation.purchaseId];

      if (sale == null || purchase == null) continue;

      final saleUsed = saleAllocated[allocation.saleId] ?? 0;
      final purchaseUsed = purchaseAllocated[allocation.purchaseId] ?? 0;

      final saleRemaining = sale.quantity - saleUsed;
      final purchaseRemaining = purchase.quantity - purchaseUsed;

      final allowedQuantity = [
        allocation.quantity,
        saleRemaining,
        purchaseRemaining,
      ].reduce((a, b) => a < b ? a : b);

      if (allowedQuantity <= 0) {
        adjustedCount++;
        continue;
      }

      if (allowedQuantity != allocation.quantity) {
        adjustedCount++;
      }

      adjusted.add(
        InventorySaleAllocationModel(
          saleId: allocation.saleId,
          purchaseId: allocation.purchaseId,
          itemId: allocation.itemId,
          quantity: allowedQuantity,
        ),
      );

      saleAllocated[allocation.saleId] = saleUsed + allowedQuantity;
      purchaseAllocated[allocation.purchaseId] =
          purchaseUsed + allowedQuantity;
    }

    return AppDataConsistencyResult(
      allocations: adjusted,
      salePurchaseLinks: cleanedLinks,
      removedAllocations: allocations.length - relationCleanedAllocations.length,
      removedLinks: salePurchaseLinks.length - cleanedLinks.length,
      adjustedAllocations: adjustedCount,
    );
  }
}