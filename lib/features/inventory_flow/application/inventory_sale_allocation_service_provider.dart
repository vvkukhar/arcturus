import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_service.dart';

final inventorySaleAllocationServiceProvider =
    Provider<InventorySaleAllocationService>((ref) {
  return const InventorySaleAllocationService();
});