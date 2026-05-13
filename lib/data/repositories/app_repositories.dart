import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';

class BaseRepository<T> {
  final String storageKey;
  final SharedPreferences prefs;
  final T Function(Map<String, dynamic>) fromMap;
  final Map<String, dynamic> Function(T) toMap;
  List<T> _cache = [];

  BaseRepository(this.prefs, this.storageKey, this.fromMap, this.toMap) {
    _initSync();
  }

  void _initSync() {
    final data = prefs.getString(storageKey);
    if (data != null) {
      final list = jsonDecode(data) as List;
      _cache = list.map((e) => fromMap(Map<String, dynamic>.from(e))).toList();
    }
  }

  Future<void> _persist() async {
    await prefs.setString(storageKey, jsonEncode(_cache.map(toMap).toList()));
  }

  List<T> getAll() => List.unmodifiable(_cache);
  
  Future<void> replaceAll(List<T> items) async {
    _cache = List.from(items);
    await _persist();
  }

  Future<void> add(T item) async {
    _cache.insert(0, item);
    await _persist();
  }

  Future<void> update(bool Function(T) matcher, T newItem) async {
    final idx = _cache.indexWhere(matcher);
    if (idx != -1) {
      _cache[idx] = newItem;
      await _persist();
    }
  }

  Future<void> delete(bool Function(T) matcher) async {
    _cache.removeWhere(matcher);
    await _persist();
  }
}

class InventoryRepository extends BaseRepository<ItemModel> {
  InventoryRepository(SharedPreferences prefs) : super(prefs, 'repo_inventory', ItemModel.fromMap, (e) => e.toMap());
  ItemModel? getById(String id) => getAll().where((e) => e.id == id).firstOrNull;
  List<ItemModel> getAllItems() => getAll();
  Future<void> addItem(ItemModel item) => add(item);
  Future<void> updateItem(ItemModel item) => update((e) => e.id == item.id, item);
}

class PurchasesRepository extends BaseRepository<PurchaseModel> {
  PurchasesRepository(SharedPreferences prefs) : super(prefs, 'repo_purchases', PurchaseModel.fromJson, (e) => e.toJson());
  List<PurchaseModel> getAllPurchases() => getAll();
}

class SalesRepository extends BaseRepository<SaleModel> {
  SalesRepository(SharedPreferences prefs) : super(prefs, 'repo_sales', SaleModel.fromJson, (e) => e.toJson());
  List<SaleModel> getAllSales() => getAll();
}

class WatchlistRepository extends BaseRepository<WatchlistItemModel> {
  WatchlistRepository(SharedPreferences prefs) : super(prefs, 'repo_watchlist', WatchlistItemModel.fromMap, (e) => e.toMap());
}

class MarketRepository extends BaseRepository<MarketSnapshotModel> {
  MarketRepository(SharedPreferences prefs) : super(prefs, 'repo_market', MarketSnapshotModel.fromMap, (e) => e.toMap());
}

class PartOutRepository {
  List<dynamic> getAllProjects() => [];
  List<dynamic> getLinesByProjectId(String id) => [];
}