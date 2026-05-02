// lib/data/store/purchases_memory_store.dart

import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchasesMemoryStore {
  PurchasesMemoryStore._();

  static final List<PurchaseModel> _purchases = [];

  static List<PurchaseModel> get purchases => List.from(_purchases);

  static void replaceAll(List<PurchaseModel> items) {
    _purchases
      ..clear()
      ..addAll(items);
  }

  static void hydrate(List<PurchaseModel> items) {
    replaceAll(items);
  }

  static void addPurchase(PurchaseModel purchase) {
    _purchases.insert(0, purchase);
  }

  static void updatePurchase(PurchaseModel updatedPurchase) {
    final index =
        _purchases.indexWhere((purchase) => purchase.id == updatedPurchase.id);
    if (index == -1) return;
    _purchases[index] = updatedPurchase;
  }

  static void deletePurchase(String id) {
    _purchases.removeWhere((purchase) => purchase.id == id);
  }

  static List<PurchaseModel> getByItemId(String itemId) {
    return _purchases.where((purchase) => purchase.itemId == itemId).toList();
  }

  static void clear() {
    _purchases.clear();
  }
}
