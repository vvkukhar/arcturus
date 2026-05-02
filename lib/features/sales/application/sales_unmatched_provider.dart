import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';

final salesUnmatchedProvider = Provider<List<SaleModel>>((ref) {
  final sales = ref.watch(salesControllerProvider);
  final purchases = ref.watch(purchasesControllerProvider);
  final links = ref.watch(salePurchaseLinkControllerProvider);

  final purchaseIds = purchases.map((purchase) => purchase.id).toSet();
  final purchaseItemIds = purchases.map((purchase) => purchase.itemId).toSet();

  final linkedSaleIds = links
      .where((link) => purchaseIds.contains(link.purchaseId))
      .map((link) => link.saleId)
      .toSet();

  final unmatched = sales.where((sale) {
    final hasManualLink = linkedSaleIds.contains(sale.id);
    final hasItemMatch = purchaseItemIds.contains(sale.itemId);

    return !hasManualLink && !hasItemMatch;
  }).toList();

  unmatched.sort((a, b) => b.saleDate.compareTo(a.saleDate));

  return unmatched;
});