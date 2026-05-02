import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_fifo_allocation_service.dart';

final inventoryFifoAllocationProvider =
    Provider<InventoryFifoAllocationService>((ref) {
  return const InventoryFifoAllocationService();
});