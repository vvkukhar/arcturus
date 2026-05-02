import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sales_allocated_profit_summary_model.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';

final salesAllocatedProfitSummaryProvider =
    Provider<SalesAllocatedProfitSummaryModel>((ref) {
  final sales = ref.watch(salesControllerProvider);
  final purchases = ref.watch(purchasesWithStockProvider);
  final allocations = ref.watch(inventorySaleAllocationControllerProvider);

  int allocatedSales = 0;
  int totalUnits = 0;
  int allocatedUnits = 0;

  double totalNet = 0;
  double allocatedCost = 0;
  double allocatedProfit = 0;
  double roiTotal = 0;

  for (final sale in sales) {
    totalUnits += sale.quantity;
    totalNet += sale.finalNet;

    final saleAllocations = allocations.where((allocation) {
      return allocation.saleId == sale.id;
    }).toList();

    if (saleAllocations.isEmpty) {
      continue;
    }

    int saleAllocatedUnits = 0;
    double saleCost = 0;

    for (final allocation in saleAllocations) {
      saleAllocatedUnits += allocation.quantity;

      final matches = purchases.where((purchase) {
        return purchase.id == allocation.purchaseId;
      });

      if (matches.isEmpty) continue;

      final purchase = matches.first;
      saleCost += purchase.unitCost * allocation.quantity;
    }

    allocatedSales++;
    allocatedUnits += saleAllocatedUnits;

    final allocatedNet = sale.quantity <= 0
        ? sale.finalNet
        : sale.unitNet * saleAllocatedUnits;

    final profit = allocatedNet - saleCost;
    final roi = saleCost <= 0 ? 0 : profit / saleCost * 100;

    allocatedCost += saleCost;
    allocatedProfit += profit;
    roiTotal += roi;
  }

  return SalesAllocatedProfitSummaryModel(
    totalSales: sales.length,
    allocatedSales: allocatedSales,
    unallocatedSales: sales.length - allocatedSales,
    totalUnits: totalUnits,
    allocatedUnits: allocatedUnits,
    unallocatedUnits: totalUnits - allocatedUnits,
    totalNet: totalNet,
    allocatedCost: allocatedCost,
    allocatedProfit: allocatedProfit,
    averageAllocatedRoiPercent:
        allocatedSales == 0 ? 0 : roiTotal / allocatedSales,
    averageUnitProfit: allocatedUnits <= 0 ? 0 : allocatedProfit / allocatedUnits,
  );
});