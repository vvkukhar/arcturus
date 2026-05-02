import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_controller.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sales_stock_flow_summary_model.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';

final salesStockFlowSummaryProvider =
    Provider<SalesStockFlowSummaryModel>((ref) {
  final sales = ref.watch(salesControllerProvider);
  final allocations = ref.watch(inventorySaleAllocationControllerProvider);

  int totalUnits = 0;
  int fullyAllocatedSales = 0;
  int partiallyAllocatedSales = 0;
  int openSales = 0;
  int overAllocatedSales = 0;
  int allocatedUnits = 0;

  for (final sale in sales) {
    totalUnits += sale.quantity;

    final saleAllocatedUnits = allocations
        .where((allocation) => allocation.saleId == sale.id)
        .fold<int>(
          0,
          (sum, allocation) => sum + allocation.quantity,
        );

    allocatedUnits += saleAllocatedUnits;

    if (saleAllocatedUnits == 0) {
      openSales++;
    } else if (saleAllocatedUnits > sale.quantity) {
      overAllocatedSales++;
    } else if (saleAllocatedUnits == sale.quantity) {
      fullyAllocatedSales++;
    } else {
      partiallyAllocatedSales++;
    }
  }

  return SalesStockFlowSummaryModel(
    totalSales: sales.length,
    totalUnits: totalUnits,
    fullyAllocatedSales: fullyAllocatedSales,
    partiallyAllocatedSales: partiallyAllocatedSales,
    openSales: openSales,
    overAllocatedSales: overAllocatedSales,
    allocatedUnits: allocatedUnits,
    openUnits: totalUnits - allocatedUnits,
  );
});