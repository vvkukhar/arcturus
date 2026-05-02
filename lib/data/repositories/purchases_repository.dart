// lib/data/repositories/purchases_repository.dart

import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/store/purchases_memory_store.dart';

class PurchasesRepository {
  List<PurchaseModel> getAllPurchases() {
    return PurchasesMemoryStore.purchases;
  }

  List<PurchaseModel> getPurchasesByItemId(String itemId) {
    return PurchasesMemoryStore.getByItemId(itemId);
  }

  void addPurchase(PurchaseModel purchase) {
    PurchasesMemoryStore.addPurchase(purchase);
  }

  void updatePurchase(PurchaseModel purchase) {
    PurchasesMemoryStore.updatePurchase(purchase);
  }

  void deletePurchase(String id) {
    PurchasesMemoryStore.deletePurchase(id);
  }
}
