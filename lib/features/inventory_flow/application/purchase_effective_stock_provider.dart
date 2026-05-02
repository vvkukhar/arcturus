import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';

final purchaseEffectiveStockProvider =
    Provider.family<PurchaseModel?, String>((ref, purchaseId) {
  final purchases = ref.watch(purchasesWithStockProvider);

  for (final purchase in purchases) {
    if (purchase.id == purchaseId) {
      return purchase;
    }
  }

  return null;
});