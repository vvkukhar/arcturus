import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_model.dart';
import 'package:lego_trading_manager/features/sales/data/sale_purchase_links_local_storage_provider.dart';

class SalePurchaseLinkController extends Notifier<List<SalePurchaseLinkModel>> {
  @override
  List<SalePurchaseLinkModel> build() {
    return const [];
  }

  Future<void> load() async {
    final storage = ref.read(salePurchaseLinksLocalStorageProvider);
    state = await storage.read();
  }

  Future<void> _save() async {
    final storage = ref.read(salePurchaseLinksLocalStorageProvider);
    await storage.write(state);
  }

  String? purchaseIdForSale(String saleId) {
    for (final link in state) {
      if (link.saleId == saleId) return link.purchaseId;
    }
    return null;
  }

  Future<void> link({required String saleId, required String purchaseId}) async {
    final next = state.where((link) => link.saleId != saleId).toList();
    next.add(SalePurchaseLinkModel(saleId: saleId, purchaseId: purchaseId));
    
    state = next;
    await _save();
  }

  Future<void> unlinkSale(String saleId) async {
    state = state.where((link) => link.saleId != saleId).toList();
    await _save();
  }

  Future<void> unlinkPurchase(String purchaseId) async {
    state = state.where((link) => link.purchaseId != purchaseId).toList();
    await _save();
  }

  Future<void> replaceAll(List<SalePurchaseLinkModel> links) async {
    state = links;
    await _save();
  }

  Future<void> clear() async {
    state = const [];
    await _save();
  }
}

final salePurchaseLinkControllerProvider =
    NotifierProvider<SalePurchaseLinkController, List<SalePurchaseLinkModel>>(
  SalePurchaseLinkController.new,
);