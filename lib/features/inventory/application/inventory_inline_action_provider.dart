import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_inline_action_service.dart';

final inventoryInlineActionProvider =
    Provider<InventoryInlineActionService>((ref) {
  return InventoryInlineActionService(ref);
});