// lib/features/inventory/application/inventory_duplicate_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_duplicate_service.dart';

final inventoryDuplicateServiceProvider =
    Provider<InventoryDuplicateService>((ref) {
  return InventoryDuplicateService();
});
