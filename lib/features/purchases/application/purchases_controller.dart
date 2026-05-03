import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/data/purchases_local_storage_provider.dart';

// 1. Переходимо зі StateNotifier на сучасний Notifier
class PurchasesController extends Notifier<List<PurchaseModel>> {
  
  @override
  List<PurchaseModel> build() {
    // Початковий стан. З Notifier ми маємо нативний доступ до ref.
    return const [];
  }

  Future<void> load() async {
    final storage = ref.read(purchasesLocalStorageProvider);
    state = await storage.read();
  }

  Future<void> _save() async {
    final storage = ref.read(purchasesLocalStorageProvider);
    await storage.write(state);
  }

  Future<void> addPurchase(PurchaseModel purchase) async {
    state = [...state, purchase];
    await _save();
  }

  Future<void> updatePurchase(PurchaseModel updated) async {
    state = [
      for (final purchase in state)
        if (purchase.id == updated.id) updated else purchase,
    ];
    await _save();
  }

  Future<void> deletePurchase(String id) async {
    state = state.where((purchase) => purchase.id != id).toList();
    await _save();
  }

  Future<void> replaceAll(List<PurchaseModel> purchases) async {
    state = purchases;
    await _save();
  }

  Future<void> clear() async {
    state = const [];
    await _save();
  }
}

// Провайдер тепер теж NotifierProvider
final purchasesControllerProvider =
    NotifierProvider<PurchasesController, List<PurchaseModel>>(
  PurchasesController.new,
);