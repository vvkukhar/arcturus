import 'package:lego_trading_manager/data/models/purchase_model.dart';

abstract class AbstractPurchasesDatasource {
  Future<List<PurchaseModel>> getAll();
  Future<List<PurchaseModel>> getByItemId(String itemId);
  Future<void> add(PurchaseModel purchase);
  Future<void> update(PurchaseModel purchase);
  Future<void> delete(String id);
  Future<void> replaceAll(List<PurchaseModel> purchases);
}