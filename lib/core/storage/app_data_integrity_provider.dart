import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_data_integrity_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';

final appDataIntegrityProvider = Provider<AppDataIntegrityModel>((ref) {
  final purchases = ref.watch(purchasesControllerProvider);
  final sales = ref.watch(salesControllerProvider);
  final allocations = ref.watch(inventorySaleAllocationControllerProvider);
  final links = ref.watch(salePurchaseLinkControllerProvider);

  final purchaseIds = purchases.map((purchase) => purchase.id).toSet();
  final saleIds = sales.map((sale) => sale.id).toSet();

  final orphanAllocationsCount = allocations.where((allocation) {
    return !saleIds.contains(allocation.saleId) ||
        !purchaseIds.contains(allocation.purchaseId);
  }).length;

  final orphanLinksCount = links.where((link) {
    return !saleIds.contains(link.saleId) ||
        !purchaseIds.contains(link.purchaseId);
  }).length;

  var overAllocatedSalesCount = 0;

  for (final sale in sales) {
    final allocated = allocations
        .where((allocation) => allocation.saleId == sale.id)
        .fold<int>(0, (sum, allocation) => sum + allocation.quantity);

    if (allocated > sale.quantity) {
      overAllocatedSalesCount++;
    }
  }

  var overSoldPurchasesCount = 0;

  for (final purchase in purchases) {
    final sold = allocations
        .where((allocation) => allocation.purchaseId == purchase.id)
        .fold<int>(0, (sum, allocation) => sum + allocation.quantity);

    if (sold > purchase.quantity) {
      overSoldPurchasesCount++;
    }
  }

  final isHealthy = orphanAllocationsCount == 0 &&
      orphanLinksCount == 0 &&
      overAllocatedSalesCount == 0 &&
      overSoldPurchasesCount == 0;

  return AppDataIntegrityModel(
    purchasesCount: purchases.length,
    salesCount: sales.length,
    allocationsCount: allocations.length,
    linksCount: links.length,
    orphanAllocationsCount: orphanAllocationsCount,
    orphanLinksCount: orphanLinksCount,
    overAllocatedSalesCount: overAllocatedSalesCount,
    overSoldPurchasesCount: overSoldPurchasesCount,
    isHealthy: isHealthy,
  );
});