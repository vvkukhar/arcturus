import 'package:lego_trading_manager/data/datasources/local/market_local_datasource.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';

class MarketRepository {
  final MarketLocalDatasource _localDatasource;
  List<MarketSnapshotModel> _memoryCache = [];
  bool _isLoaded = false;

  MarketRepository(this._localDatasource);

  Future<void> loadCache() async {
    _memoryCache = await _localDatasource.getAll();
    _isLoaded = true;
  }

  List<MarketSnapshotModel> getAll() {
    if (!_isLoaded) throw StateError('MarketRepository accessed before loadCache()');
    return List<MarketSnapshotModel>.from(_memoryCache);
  }

  MarketSnapshotModel? getById(String id) {
    if (!_isLoaded) throw StateError('MarketRepository accessed before loadCache()');
    try {
      return _memoryCache.firstWhere((s) => s.id == id);
    } catch (_) {
      return null;
    }
  }

  List<MarketSnapshotModel> getByItemRef(String itemRef) {
    if (!_isLoaded) throw StateError('MarketRepository accessed before loadCache()');
    final items = _memoryCache.where((s) => s.itemRef == itemRef).toList();
    items.sort((a, b) => b.capturedAt.compareTo(a.capturedAt));
    return items;
  }

  Future<void> add(MarketSnapshotModel snapshot) async {
    await _localDatasource.add(snapshot);
    _memoryCache.insert(0, snapshot);
  }

  Future<void> update(MarketSnapshotModel snapshot) async {
    await _localDatasource.update(snapshot);
    final index = _memoryCache.indexWhere((e) => e.id == snapshot.id);
    if (index != -1) {
      _memoryCache[index] = snapshot;
    }
  }

  Future<void> delete(String id) async {
    await _localDatasource.delete(id);
    _memoryCache.removeWhere((e) => e.id == id);
  }

  Future<void> replaceAll(List<MarketSnapshotModel> snapshots) async {
    await _localDatasource.replaceAll(snapshots);
    _memoryCache = List.from(snapshots);
  }
}