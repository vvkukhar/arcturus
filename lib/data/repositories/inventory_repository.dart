import 'package:lego_trading_manager/data/datasources/local/inventory_local_datasource.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

class InventoryRepository {
  final InventoryLocalDatasource _localDatasource;
  List<ItemModel> _memoryCache = [];
  bool _isLoaded = false;

  InventoryRepository(this._localDatasource);

  Future<void> loadCache() async {
    _memoryCache = await _localDatasource.getAll();
    _isLoaded = true;
  }

  List<ItemModel> getAllItems() {
    if (!_isLoaded) throw StateError('InventoryRepository accessed before loadCache()');
    return List<ItemModel>.from(_memoryCache);
  }

  List<ItemModel> getSoldItems() {
    if (!_isLoaded) throw StateError('InventoryRepository accessed before loadCache()');
    return _memoryCache.where((item) => item.isSold).toList();
  }

  Future<void> addItem(ItemModel item) async {
    await _localDatasource.add(item);
    _memoryCache.insert(0, item);
  }

  Future<void> updateItem(ItemModel item) async {
    await _localDatasource.update(item);
    final index = _memoryCache.indexWhere((e) => e.id == item.id);
    if (index != -1) {
      _memoryCache[index] = item;
    }
  }

  Future<void> deleteItem(String id) async {
    await _localDatasource.delete(id);
    _memoryCache.removeWhere((e) => e.id == id);
  }

  ItemModel? getById(String id) {
    if (!_isLoaded) throw StateError('InventoryRepository accessed before loadCache()');
    try {
      return _memoryCache.firstWhere((e) => e.id == id);
    } catch (_) {
      return null;
    }
  }

  Future<void> replaceAll(List<ItemModel> items) async {
    await _localDatasource.replaceAll(items);
    _memoryCache = List.from(items);
  }
}