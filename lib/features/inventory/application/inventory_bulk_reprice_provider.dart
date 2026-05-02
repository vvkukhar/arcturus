// lib/features/inventory/application/inventory_bulk_reprice_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_reprice_usecase.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_reprice_provider.dart';

final inventoryBulkRepriceProvider =
    Provider<InventoryBulkRepriceUsecase>((ref) {
  return InventoryBulkRepriceUsecase(
    ref.watch(inventoryRepriceServiceProvider),
  );
});
