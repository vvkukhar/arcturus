import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/inventory_sale_allocation_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/data/inventory_allocations_local_storage_provider.dart';

class InventorySaleAllocationController extends Notifier<List<InventorySaleAllocationModel>> {
  @override
  List<InventorySaleAllocationModel> build() {
    return const [];
  }

  Future<void> load() async {
    final storage = ref.read(inventoryAllocationsLocalStorageProvider);
    state = await storage.read();
  }

  Future<void> _save() async {
    final storage = ref.read(inventoryAllocationsLocalStorageProvider);
    await storage.write(state);
  }

  List<InventorySaleAllocationModel> allocationsForSale(String saleId) {
    return state.where((allocation) => allocation.saleId == saleId).toList();
  }

  List<InventorySaleAllocationModel> allocationsForPurchase(String purchaseId) {
    return state.where((allocation) => allocation.purchaseId == purchaseId).toList();
  }

  int allocatedQuantityForSale(String saleId) {
    return allocationsForSale(saleId).fold<int>(0, (sum, allocation) => sum + allocation.quantity);
  }

  int soldFromPurchase(String purchaseId) {
    return allocationsForPurchase(purchaseId).fold<int>(0, (sum, allocation) => sum + allocation.quantity);
  }

  Future<void> allocate({
    required String saleId,
    required String purchaseId,
    required String itemId,
    required int quantity,
  }) async {
    if (quantity <= 0) return;

    final next = state.where((allocation) => allocation.saleId != saleId).toList();
    next.add(
      InventorySaleAllocationModel(
        saleId: saleId,
        purchaseId: purchaseId,
        itemId: itemId,
        quantity: quantity,
      ),
    );

    state = next;
    await _save();
  }

  Future<void> replaceSaleAllocations({
    required String saleId,
    required List<InventorySaleAllocationModel> allocations,
  }) async {
    final next = state.where((allocation) => allocation.saleId != saleId).toList();
    next.addAll(allocations.where((a) => a.saleId == saleId && a.quantity > 0));

    state = next;
    await _save();
  }

  Future<void> addOrReplaceLot({
    required String saleId,
    required String purchaseId,
    required String itemId,
    required int quantity,
  }) async {
    if (quantity <= 0) return;

    final next = state.where((a) => !(a.saleId == saleId && a.purchaseId == purchaseId)).toList();
    next.add(
      InventorySaleAllocationModel(
        saleId: saleId,
        purchaseId: purchaseId,
        itemId: itemId,
        quantity: quantity,
      ),
    );

    state = next;
    await _save();
  }

  Future<void> updateLotQuantity({
    required String saleId,
    required String purchaseId,
    required int quantity,
  }) async {
    if (quantity <= 0) {
      await removeLot(saleId: saleId, purchaseId: purchaseId);
      return;
    }

    state = [
      for (final a in state)
        if (a.saleId == saleId && a.purchaseId == purchaseId)
          InventorySaleAllocationModel(
            saleId: a.saleId,
            purchaseId: a.purchaseId,
            itemId: a.itemId,
            quantity: quantity,
          )
        else
          a
    ];
    await _save();
  }

  Future<void> removeLot({required String saleId, required String purchaseId}) async {
    state = state.where((a) => !(a.saleId == saleId && a.purchaseId == purchaseId)).toList();
    await _save();
  }

  Future<void> clearSale(String saleId) async {
    state = state.where((a) => a.saleId != saleId).toList();
    await _save();
  }

  Future<void> clearPurchase(String purchaseId) async {
    state = state.where((a) => a.purchaseId != purchaseId).toList();
    await _save();
  }

  Future<void> replaceAll(List<InventorySaleAllocationModel> allocations) async {
    state = allocations;
    await _save();
  }

  Future<void> clearAll() async {
    state = const [];
    await _save();
  }
}

final inventorySaleAllocationControllerProvider =
    NotifierProvider<InventorySaleAllocationController, List<InventorySaleAllocationModel>>(
  InventorySaleAllocationController.new,
);