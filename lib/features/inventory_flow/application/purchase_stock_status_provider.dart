import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchase_stock_status_model.dart';

final purchaseStockStatusProvider =
    Provider.family<PurchaseStockStatusModel, PurchaseModel>((ref, purchase) {
  return PurchaseStockStatusModel(
    purchaseId: purchase.id,
    itemId: purchase.itemId,
    quantity: purchase.quantity,
    soldQuantity: purchase.soldQuantity,
    remainingQuantity: purchase.remainingQuantity,
    isFullySold: purchase.isFullySold,
  );
});