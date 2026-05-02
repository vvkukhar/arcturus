import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchasesExportRowMapper {
  static List<String> map(PurchaseModel purchase) {
    return [
      purchase.id,
      purchase.itemId,
      purchase.source,
      purchase.purchasePrice.toString(),
      purchase.shippingCost.toString(),
      purchase.additionalCosts.toString(),
      purchase.finalTotal.toString(),
      purchase.currency,
      purchase.purchaseDate.toIso8601String(),
    ];
  }
}
