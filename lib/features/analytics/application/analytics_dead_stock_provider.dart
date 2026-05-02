// lib/features/analytics/application/analytics_dead_stock_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';

final analyticsDeadStockItemsProvider = Provider<List<ItemModel>>((ref) {
  final items = InventoryRepository().getAllItems();

  final active = items.where((item) => item.isActive).toList();
  active.sort(
    (a, b) => (b.daysInInventory ?? 0).compareTo(a.daysInInventory ?? 0),
  );

  return active.take(10).toList();
});
