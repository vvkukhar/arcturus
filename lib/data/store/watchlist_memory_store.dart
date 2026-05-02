// lib/data/store/watchlist_memory_store.dart

import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class WatchlistMemoryStore {
  WatchlistMemoryStore._();

  static final List<WatchlistItemModel> _items = [];

  static List<WatchlistItemModel> get items => List.from(_items);

  static void replaceAll(List<WatchlistItemModel> items) {
    _items
      ..clear()
      ..addAll(items);
  }

  static void hydrate(List<WatchlistItemModel> items) {
    replaceAll(items);
  }

  static void add(WatchlistItemModel item) {
    _items.insert(0, item);
  }

  static void update(WatchlistItemModel updatedItem) {
    final index = _items.indexWhere((item) => item.id == updatedItem.id);
    if (index == -1) return;
    _items[index] = updatedItem;
  }

  static void delete(String id) {
    _items.removeWhere((item) => item.id == id);
  }

  static WatchlistItemModel? getById(String id) {
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
