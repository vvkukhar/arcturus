import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_profit_summary_model.dart';

final analyticsProfitSummaryProvider =
    Provider<AnalyticsProfitSummaryModel>((ref) {
  final items = InventoryRepository().getAllItems();

  final totalCost = items.fold<double>(
    0,
    (sum, item) => sum + item.totalCost.toDouble(),
  );

  final totalExpectedRevenue = items.fold<double>(
    0,
    (sum, item) => sum + (item.expectedSalePrice ?? 0).toDouble(),
  );

  final totalExpectedProfit = totalExpectedRevenue - totalCost;
  final roiPercent =
      totalCost == 0 ? 0.0 : (totalExpectedProfit / totalCost) * 100;

  return AnalyticsProfitSummaryModel(
    totalCost: totalCost,
    totalExpectedRevenue: totalExpectedRevenue,
    totalExpectedProfit: totalExpectedProfit,
    roiPercent: roiPercent,
  );
});