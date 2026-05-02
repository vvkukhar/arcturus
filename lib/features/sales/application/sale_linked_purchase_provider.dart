import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sale_purchase_link_controller.dart';

final saleLinkedPurchaseProvider =
    Provider.family<PurchaseModel?, SaleModel>((ref, sale) {
  final purchases = ref.watch(purchasesControllerProvider);
  final links = ref.watch(salePurchaseLinkControllerProvider);

  String? linkedPurchaseId;

  for (final link in links) {
    if (link.saleId == sale.id) {
      linkedPurchaseId = link.purchaseId;
      break;
    }
  }

  if (linkedPurchaseId != null) {
    for (final purchase in purchases) {
      if (purchase.id == linkedPurchaseId) {
        return purchase;
      }
    }
  }

  for (final purchase in purchases) {
    if (purchase.itemId == sale.itemId) {
      return purchase;
    }
  }

  return null;
});