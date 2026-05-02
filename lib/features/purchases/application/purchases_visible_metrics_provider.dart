import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_visible_provider.dart';

class PurchasesVisibleMetricsModel {
  final int visibleCount;
  final double totalSpent;
  final double totalShipping;
  final double totalExtra;
  final double averagePurchase;

  const PurchasesVisibleMetricsModel({
    required this.visibleCount,
    required this.totalSpent,
    required this.totalShipping,
    required this.totalExtra,
    required this.averagePurchase,
  });
}

final purchasesVisibleMetricsProvider =
    Provider<PurchasesVisibleMetricsModel>((ref) {
  final purchases = ref.watch(purchasesVisibleProvider);

  final totalSpent =
      purchases.fold<double>(0, (sum, purchase) => sum + purchase.finalTotal);

  return PurchasesVisibleMetricsModel(
    visibleCount: purchases.length,
    totalSpent: totalSpent,
    totalShipping: purchases.fold<double>(
      0,
      (sum, purchase) => sum + purchase.shippingCost,
    ),
    totalExtra: purchases.fold<double>(
      0,
      (sum, purchase) => sum + purchase.additionalCosts,
    ),
    averagePurchase: purchases.isEmpty ? 0 : totalSpent / purchases.length,
  );
});