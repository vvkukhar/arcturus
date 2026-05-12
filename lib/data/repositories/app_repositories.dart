import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';

class BaseRepository<T> {
  final String storageKey;
  final T Function(Map<String, dynamic>) fromMap;
  final Map<String, dynamic> Function(T) toMap;
  List<T> _cache = [];

  BaseRepository(this.storageKey, this.fromMap, this.toMap);

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString(storageKey);
    if (data != null) {
      final list = jsonDecode(data) as List;
      _cache = list.map((e) => fromMap(Map<String, dynamic>.from(e))).toList();
    }
  }

  Future<void> _persist() async {
    final prefs = await SharedPreferences.getInstance();
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
  InventoryRepository() : super('repo_inventory', ItemModel.fromMap, (e) => e.toMap());
  List<ItemModel> getAllItems() => getAll();
  ItemModel? getById(String id) => getAllItems().where((e) => e.id == id).firstOrNull;
  Future<void> addItem(ItemModel item) => add(item);
  Future<void> updateItem(ItemModel item) => update((e) => e.id == item.id, item);
}

class PurchasesRepository extends BaseRepository<PurchaseModel> {
  PurchasesRepository() : super('repo_purchases', PurchaseModel.fromJson, (e) => e.toJson());
  List<PurchaseModel> getAllPurchases() => getAll();
  List<PurchaseModel> getPurchasesByItemId(String itemId) => getAllPurchases().where((e) => e.itemId == itemId).toList();
}

class SalesRepository extends BaseRepository<SaleModel> {
  SalesRepository() : super('repo_sales', SaleModel.fromJson, (e) => e.toJson());
  List<SaleModel> getAllSales() => getAll();
  SaleModel? getByItemId(String itemId) => getAllSales().where((e) => e.itemId == itemId).firstOrNull;
}

class WatchlistRepository extends BaseRepository<WatchlistItemModel> {
  WatchlistRepository() : super('repo_watchlist', WatchlistItemModel.fromMap, (e) => e.toMap());
}

class MarketRepository extends BaseRepository<MarketSnapshotModel> {
  MarketRepository() : super('repo_market', MarketSnapshotModel.fromMap, (e) => e.toMap());
}

class PartOutRepository {
  List<dynamic> getAllProjects() => [];
  List<dynamic> getLinesByProjectId(String id) => [];
}

final inventoryRepositoryProvider = Provider((ref) => InventoryRepository());
final purchasesRepositoryProvider = Provider((ref) => PurchasesRepository());
final salesRepositoryProvider = Provider((ref) => SalesRepository());
final watchlistRepositoryProvider = Provider((ref) => WatchlistRepository());
final marketRepositoryProvider = Provider((ref) => MarketRepository());
final partOutRepositoryProvider = Provider((ref) => PartOutRepository());