// lib/features/inventory/application/inventory_reprice_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_reprice_service.dart';

final inventoryRepriceServiceProvider =
    Provider<InventoryRepriceService>((ref) {
  return InventoryRepriceService();
});
