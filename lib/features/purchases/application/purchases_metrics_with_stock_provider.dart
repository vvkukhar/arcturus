import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory_flow/application/purchases_with_stock_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_metrics_provider.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_visible_with_stock_provider.dart';

final purchasesMetricsWithStockProvider = Provider<PurchasesMetricsModel>((ref) {
  final all = ref.watch(purchasesWithStockProvider);
  final visible = ref.watch(purchasesVisibleWithStockProvider);

  final totalSpend = all.fold<double>(
    0,
    (sum, item) => sum + item.finalTotal,
  );

  final visibleSpend = visible.fold<double>(
    0,
    (sum, item) => sum + item.finalTotal,
  );

  final shippingTotal = visible.fold<double>(
    0,
    (sum, item) => sum + item.shippingCost,
  );

  final averagePurchase = visible.isEmpty ? 0 : visibleSpend / visible.length;
  final averageShipping = visible.isEmpty ? 0 : shippingTotal / visible.length;

  return PurchasesMetricsModel(
    totalCount: all.length,
    visibleCount: visible.length,
    totalSpend: totalSpend,
    visibleSpend: visibleSpend,
    averagePurchase: averagePurchase,
    averageShipping: averageShipping,
  );
});