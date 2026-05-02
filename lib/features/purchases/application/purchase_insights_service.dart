// lib/features/purchases/application/purchase_insights_service.dart

import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseInsightsService {
  String total(PurchaseModel purchase) {
    return purchase.finalTotal.toStringAsFixed(2);
  }

  String shippingShare(PurchaseModel purchase) {
    if (purchase.finalTotal <= 0) return '0.0';
    return ((purchase.shippingCost / purchase.finalTotal) * 100)
        .toStringAsFixed(1);
  }

  String extraShare(PurchaseModel purchase) {
    if (purchase.finalTotal <= 0) return '0.0';
    return ((purchase.additionalCosts / purchase.finalTotal) * 100)
        .toStringAsFixed(1);
  }
}
