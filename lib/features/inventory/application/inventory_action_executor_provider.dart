import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_executor_service.dart';

final inventoryActionExecutorProvider =
    Provider<InventoryActionExecutorService>((ref) {
  return InventoryActionExecutorService(ref);
});
