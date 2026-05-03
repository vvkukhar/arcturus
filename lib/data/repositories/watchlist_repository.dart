import 'package:lego_trading_manager/data/datasources/local/watchlist_local_datasource.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class WatchlistRepository {
  final WatchlistLocalDatasource _localDatasource;
  List<WatchlistItemModel> _memoryCache = [];
  bool _isLoaded = false;

  WatchlistRepository(this._localDatasource);

  Future<void> loadCache() async {
    _memoryCache = await _localDatasource.getAll();
    _isLoaded = true;
  }

  List<WatchlistItemModel> getAll() {
    if (!_isLoaded) throw StateError('WatchlistRepository accessed before loadCache()');
    return List<WatchlistItemModel>.from(_memoryCache);
  }

  WatchlistItemModel? getById(String id) {
    if (!_isLoaded) throw StateError('WatchlistRepository accessed before loadCache()');
    try {
      return _memoryCache.firstWhere((item) => item.id == id);
    } catch (_) {
      return null;
    }
  }

  Future<void> add(WatchlistItemModel item) async {
    await _localDatasource.add(item);
    _memoryCache.insert(0, item);
  }

  Future<void> update(WatchlistItemModel item) async {
    await _localDatasource.update(item);
    final index = _memoryCache.indexWhere((e) => e.id == item.id);
    if (index != -1) {
      _memoryCache[index] = item;
    }
  }

  Future<void> delete(String id) async {
    await _localDatasource.delete(id);
    _memoryCache.removeWhere((e) => e.id == id);
  }

  Future<void> replaceAll(List<WatchlistItemModel> items) async {
    await _localDatasource.replaceAll(items);
    _memoryCache = List.from(items);
  }
}