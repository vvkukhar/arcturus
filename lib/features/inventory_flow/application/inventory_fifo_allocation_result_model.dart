import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_model.dart';

class InventoryFifoAllocationResultModel {
  final bool success;
  final int requestedQuantity;
  final int allocatedQuantity;
  final int missingQuantity;
  final List<InventorySaleAllocationModel> allocations;
  final String message;

  const InventoryFifoAllocationResultModel({
    required this.success,
    required this.requestedQuantity,
    required this.allocatedQuantity,
    required this.missingQuantity,
    required this.allocations,
    required this.message,
  });
}