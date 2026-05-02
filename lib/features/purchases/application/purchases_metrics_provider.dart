import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_visible_provider.dart';

class PurchasesMetricsModel {
  final int totalCount;
  final int visibleCount;
  final double totalSpend;
  final double visibleSpend;
  final double averagePurchase;
  final double averageShipping;

  const PurchasesMetricsModel({
    required this.totalCount,
    required this.visibleCount,
    required this.totalSpend,
    required this.visibleSpend,
    required this.averagePurchase,
    required this.averageShipping,
  });
}

final purchasesMetricsProvider = Provider<PurchasesMetricsModel>((ref) {
  final all = ref.watch(purchasesControllerProvider);
  final visible = ref.watch(purchasesVisibleProvider);

  final totalSpend = all.fold<double>(
    0,
    (sum, item) => sum + item.finalTotal,
  );

  final visibleSpend = visible.fold<double>(
    0,
    (sum, item) => sum + item.finalTotal,
  );

  final averagePurchase = visible.isEmpty ? 0 : visibleSpend / visible.length;

  final shippingTotal = visible.fold<double>(
    0,
    (sum, item) => sum + item.shippingCost,
  );

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