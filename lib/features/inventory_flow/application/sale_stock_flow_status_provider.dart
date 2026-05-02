import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_allocation_summary_provider.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/sale_stock_flow_status_model.dart';

final saleStockFlowStatusProvider =
    Provider.family<SaleStockFlowStatusModel, SaleModel>((ref, sale) {
  final allocation = ref.watch(saleAllocationSummaryProvider(sale));

  final isFullyAllocated = allocation.allocatedQuantity == sale.quantity;
  final isOverAllocated = allocation.allocatedQuantity > sale.quantity;

  final label = isOverAllocated
      ? 'overallocated'
      : isFullyAllocated
          ? 'stock closed'
          : allocation.allocatedQuantity == 0
              ? 'stock open'
              : 'partial stock';

  return SaleStockFlowStatusModel(
    saleId: sale.id,
    saleQuantity: sale.quantity,
    allocatedQuantity: allocation.allocatedQuantity,
    isFullyAllocated: isFullyAllocated,
    isOverAllocated: isOverAllocated,
    label: label,
  );
});