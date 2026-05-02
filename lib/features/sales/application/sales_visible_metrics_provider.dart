// lib/features/sales/application/sales_visible_metrics_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sales_visible_provider.dart';

class SalesVisibleMetricsModel {
  final int visibleCount;
  final double revenue;
  final double fees;
  final double net;
  final int profitableCount;

  const SalesVisibleMetricsModel({
    required this.visibleCount,
    required this.revenue,
    required this.fees,
    required this.net,
    required this.profitableCount,
  });
}

final salesVisibleMetricsProvider = Provider<SalesVisibleMetricsModel>((ref) {
  final sales = ref.watch(salesVisibleProvider);

  return SalesVisibleMetricsModel(
    visibleCount: sales.length,
    revenue: sales.fold<double>(0, (sum, sale) => sum + sale.salePrice),
    fees: sales.fold<double>(0, (sum, sale) => sum + sale.platformFee),
    net: sales.fold<double>(0, (sum, sale) => sum + sale.finalNet),
    profitableCount: sales.where((sale) => sale.finalNet > 0).length,
  );
});
