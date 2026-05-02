import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/features/purchases/application/purchase_landed_cost_model.dart';

final purchaseLandedCostProvider =
    Provider.family<PurchaseLandedCostModel, PurchaseModel>((ref, purchase) {
  final total = purchase.finalTotal;

  final shippingShare = total <= 0 ? 0 : purchase.shippingCost / total * 100;
  final extraShare = total <= 0 ? 0 : purchase.additionalCosts / total * 100;

  return PurchaseLandedCostModel(
    purchasePrice: purchase.purchasePrice,
    shippingCost: purchase.shippingCost,
    additionalCosts: purchase.additionalCosts,
    finalTotal: total,
    shippingSharePercent: shippingShare,
    extraSharePercent: extraShare,
  );
});