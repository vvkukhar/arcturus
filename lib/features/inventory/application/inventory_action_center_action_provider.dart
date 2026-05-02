import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_center_action_service.dart';

final inventoryActionCenterActionProvider =
    Provider<InventoryActionCenterActionService>((ref) {
  return InventoryActionCenterActionService();
});
