import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseItemSyncService {
  ItemModel applyPurchase({
    required ItemModel item,
    required PurchaseModel purchase,
  }) {
    return item.copyWith(
      purchasePrice: purchase.purchasePrice,
      shippingToMe: purchase.shippingCost,
      extraCosts: purchase.additionalCosts,
      totalCost: purchase.finalTotal,
      platformBought: purchase.source,
      purchaseDate: purchase.purchaseDate,
      status: ItemStatus.purchased,
    );
  }
}