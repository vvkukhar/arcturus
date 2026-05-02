// lib/data/store/inventory_memory_store.dart

import 'package:lego_trading_manager/data/models/item_model.dart';

class InventoryMemoryStore {
  InventoryMemoryStore._();

  static final List<ItemModel> _items = [];

  static List<ItemModel> get items => List.from(_items);

  static void replaceAll(List<ItemModel> items) {
    _items
      ..clear()
      ..addAll(items);
  }

  static void hydrate(List<ItemModel> items) {
    replaceAll(items);
  }

  static void addItem(ItemModel item) {
    _items.insert(0, item);
  }

  static void updateItem(ItemModel updatedItem) {
    final index = _items.indexWhere((item) => item.id == updatedItem.id);
    if (index == -1) return;
    _items[index] = updatedItem;
  }

  static void deleteItem(String id) {
    _items.removeWhere((item) => item.id == id);
  }

  static ItemModel? getById(String id) {
    try {
      return items.firstWhere((item) => item.id == id);
    } catch (_) {
      return null;
    }
  }

  static void clear() {
    _items.clear();
  }
}
