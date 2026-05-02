import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sales_controller.dart';
import 'package:lego_trading_manager/features/sales/application/sales_visible_provider.dart';

class SalesMetricsModel {
  final int totalCount;
  final int visibleCount;
  final int totalUnits;
  final int visibleUnits;
  final double grossRevenue;
  final double visibleRevenue;
  final double totalFees;
  final double totalShippingByMe;
  final double totalNet;
  final double averageNet;
  final double averageUnitNet;

  const SalesMetricsModel({
    required this.totalCount,
    required this.visibleCount,
    required this.totalUnits,
    required this.visibleUnits,
    required this.grossRevenue,
    required this.visibleRevenue,
    required this.totalFees,
    required this.totalShippingByMe,
    required this.totalNet,
    required this.averageNet,
    required this.averageUnitNet,
  });
}

final salesMetricsProvider = Provider<SalesMetricsModel>((ref) {
  final all = ref.watch(salesControllerProvider);
  final visible = ref.watch(salesVisibleProvider);

  final totalUnits = all.fold<int>(
    0,
    (sum, item) => sum + item.quantity,
  );

  final visibleUnits = visible.fold<int>(
    0,
    (sum, item) => sum + item.quantity,
  );

  final grossRevenue = all.fold<double>(
    0,
    (sum, item) => sum + item.salePrice,
  );

  final visibleRevenue = visible.fold<double>(
    0,
    (sum, item) => sum + item.salePrice,
  );

  final totalFees = visible.fold<double>(
    0,
    (sum, item) => sum + item.platformFee,
  );

  final totalShippingByMe = visible.fold<double>(
    0,
    (sum, item) => sum + item.shippingByMe,
  );

  final totalNet = visible.fold<double>(
    0,
    (sum, item) => sum + item.finalNet,
  );

  final averageNet = visible.isEmpty ? 0 : totalNet / visible.length;
  final averageUnitNet = visibleUnits <= 0 ? 0 : totalNet / visibleUnits;

  return SalesMetricsModel(
    totalCount: all.length,
    visibleCount: visible.length,
    totalUnits: totalUnits,
    visibleUnits: visibleUnits,
    grossRevenue: grossRevenue,
    visibleRevenue: visibleRevenue,
    totalFees: totalFees,
    totalShippingByMe: totalShippingByMe,
    totalNet: totalNet,
    averageNet: averageNet,
    averageUnitNet: averageUnitNet,
  );
});