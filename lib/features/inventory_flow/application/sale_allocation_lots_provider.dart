import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_lot_view_model.dart';

final saleAllocationLotsProvider =
    Provider.family<List<SaleAllocationLotViewModel>, SaleModel>((ref, sale) {
  final allocations = ref.watch(inventorySaleAllocationControllerProvider);
  final purchases = ref.watch(purchasesWithStockProvider);

  final saleAllocations = allocations.where((allocation) {
    return allocation.saleId == sale.id;
  }).toList();

  final lots = <SaleAllocationLotViewModel>[];

  for (final allocation in saleAllocations) {
    final matches = purchases.where((purchase) {
      return purchase.id == allocation.purchaseId;
    });

    if (matches.isEmpty) continue;

    final purchase = matches.first;

    lots.add(
      SaleAllocationLotViewModel(
        purchaseId: purchase.id,
        itemId: purchase.itemId,
        source: purchase.source,
        quantity: allocation.quantity,
        unitCost: purchase.unitCost,
        totalCost: purchase.unitCost * allocation.quantity,
        currency: purchase.currency,
      ),
    );
  }

  return lots;
});