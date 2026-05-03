import 'package:lego_trading_manager/data/datasources/local/sales_local_datasource.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SalesRepository {
  final SalesLocalDatasource _localDatasource;
  List<SaleModel> _memoryCache = [];
  bool _isLoaded = false;

  SalesRepository(this._localDatasource);

  Future<void> loadCache() async {
    _memoryCache = await _localDatasource.getAll();
    _isLoaded = true;
  }

  List<SaleModel> getAllSales() {
    if (!_isLoaded) throw StateError('SalesRepository accessed before loadCache()');
    return List<SaleModel>.from(_memoryCache);
  }

  SaleModel? getByItemId(String itemId) {
    if (!_isLoaded) throw StateError('SalesRepository accessed before loadCache()');
    try {
      return _memoryCache.firstWhere((sale) => sale.itemId == itemId);
    } catch (_) {
      return null;
    }
  }

  Future<void> addSale(SaleModel sale) async {
    await _localDatasource.add(sale);
    _memoryCache.insert(0, sale);
  }

  Future<void> updateSale(SaleModel sale) async {
    await _localDatasource.update(sale);
    final index = _memoryCache.indexWhere((e) => e.id == sale.id);
    if (index != -1) {
      _memoryCache[index] = sale;
    }
  }

  Future<void> deleteSale(String id) async {
    await _localDatasource.delete(id);
    _memoryCache.removeWhere((e) => e.id == id);
  }

  Future<void> replaceAll(List<SaleModel> items) async {
    await _localDatasource.replaceAll(items);
    _memoryCache = List.from(items);
  }
}