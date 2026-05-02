// lib/features/inventory/application/inventory_bulk_apply_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_apply_service.dart';

final inventoryBulkApplyProvider = Provider<InventoryBulkApplyService>((ref) {
  return InventoryBulkApplyService(ref);
});
