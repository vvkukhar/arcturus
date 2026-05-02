import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/data/purchases_local_storage_provider.dart';

class PurchasesController extends StateNotifier<List<PurchaseModel>> {
  final Ref ref;

  PurchasesController(this.ref) : super(const []);

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
    state = state.map((purchase) {
      if (purchase.id == updated.id) return updated;
      return purchase;
    }).toList();

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

final purchasesControllerProvider =
    StateNotifierProvider<PurchasesController, List<PurchaseModel>>((ref) {
  return PurchasesController(ref);
});