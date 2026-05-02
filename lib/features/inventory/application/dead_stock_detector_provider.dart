// lib/features/inventory/application/dead_stock_detector_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_detector_service.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_entry_model.dart';

final deadStockDetectorServiceProvider =
    Provider<DeadStockDetectorService>((ref) {
  return DeadStockDetectorService();
});

final deadStockEntriesProvider = Provider<List<DeadStockEntryModel>>((ref) {
  final items = InventoryRepository().getAllItems();
  return ref.watch(deadStockDetectorServiceProvider).build(items);
});
