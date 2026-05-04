import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

final analyticsDeadStockItemsProvider = Provider<List<ItemModel>>((ref) {
  final items = ref.watch(inventoryRepositoryProvider).getAllItems();

  final active = items.where((item) => item.isActive).toList();
  active.sort(
    (a, b) => (b.daysInInventory ?? 0).compareTo(a.daysInInventory ?? 0),
  );

  return active.take(10).toList();
});