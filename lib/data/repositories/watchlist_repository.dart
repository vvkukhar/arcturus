// lib/data/repositories/watchlist_repository.dart

import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/data/store/watchlist_memory_store.dart';

class WatchlistRepository {
  List<WatchlistItemModel> getAll() {
    return WatchlistMemoryStore.items;
  }

  WatchlistItemModel? getById(String id) {
    return WatchlistMemoryStore.getById(id);
  }

  void add(WatchlistItemModel item) {
    WatchlistMemoryStore.add(item);
  }

  void update(WatchlistItemModel item) {
    WatchlistMemoryStore.update(item);
  }

  void delete(String id) {
    WatchlistMemoryStore.delete(id);
  }
}
