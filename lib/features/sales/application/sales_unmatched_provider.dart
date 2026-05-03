import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';

final salesUnmatchedProvider = Provider<List<SaleModel>>((ref) {
  final sales = ref.watch(salesControllerProvider);
  final purchases = ref.watch(purchasesControllerProvider);
  final links = ref.watch(salePurchaseLinkControllerProvider);

  // ОПТИМІЗАЦІЯ: Формуємо хеш-сети один раз
  final purchaseItemIds = <String>{};
  final linkedSaleIds = <String>{};

  for (final p in purchases) {
    purchaseItemIds.add(p.itemId);
  }

  for (final link in links) {
    linkedSaleIds.add(link.saleId);
  }

  // ОПТИМІЗАЦІЯ: Один прохід замість каскаду where
  final unmatched = sales.where((sale) {
    final hasManualLink = linkedSaleIds.contains(sale.id);
    final hasItemMatch = purchaseItemIds.contains(sale.itemId);

    return !hasManualLink && !hasItemMatch;
  }).toList();

  unmatched.sort((a, b) => b.saleDate.compareTo(a.saleDate));

  return unmatched;
});