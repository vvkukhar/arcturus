// lib/features/inventory/application/inventory_bulk_action_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_service.dart';

final inventoryBulkActionProvider = Provider<InventoryBulkActionService>((ref) {
  return InventoryBulkActionService();
});
