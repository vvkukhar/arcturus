import 'package:lego_trading_manager/data/datasources/local/purchases_local_datasource.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchasesRepository {
  final PurchasesLocalDatasource _localDatasource;
  List<PurchaseModel> _memoryCache = [];
  bool _isLoaded = false;

  PurchasesRepository(this._localDatasource);

  Future<void> loadCache() async {
    _memoryCache = await _localDatasource.getAll();
    _isLoaded = true;
  }

  List<PurchaseModel> getAllPurchases() {
    if (!_isLoaded) throw StateError('PurchasesRepository accessed before loadCache()');
    return List<PurchaseModel>.from(_memoryCache);
  }

  List<PurchaseModel> getPurchasesByItemId(String itemId) {
    if (!_isLoaded) throw StateError('PurchasesRepository accessed before loadCache()');
    return _memoryCache.where((purchase) => purchase.itemId == itemId).toList();
  }

  Future<void> addPurchase(PurchaseModel purchase) async {
    await _localDatasource.add(purchase);
    _memoryCache.insert(0, purchase);
  }

  Future<void> updatePurchase(PurchaseModel purchase) async {
    await _localDatasource.update(purchase);
    final index = _memoryCache.indexWhere((e) => e.id == purchase.id);
    if (index != -1) {
      _memoryCache[index] = purchase;
    }
  }

  Future<void> deletePurchase(String id) async {
    await _localDatasource.delete(id);
    _memoryCache.removeWhere((e) => e.id == id);
  }

  Future<void> replaceAll(List<PurchaseModel> items) async {
    await _localDatasource.replaceAll(items);
    _memoryCache = List.from(items);
  }
}