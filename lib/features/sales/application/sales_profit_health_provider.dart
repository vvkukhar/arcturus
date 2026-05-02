import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/sales/application/sales_profit_health_model.dart';
import 'package:lego_trading_manager/features/sales/application/sales_profit_summary_provider.dart';

final salesProfitHealthProvider = Provider<SalesProfitHealthModel>((ref) {
  final summary = ref.watch(salesProfitSummaryProvider);

  double score = 100;

  final totalSales = summary.totalSales;
  final totalUnits = summary.totalUnits;

  final matchedSalesRatio =
      totalSales == 0 ? 1.0 : summary.matchedSales / totalSales;

  final matchedUnitsRatio =
      totalUnits == 0 ? 1.0 : summary.matchedUnits / totalUnits;

  if (totalSales == 0) score = 0;

  if (matchedSalesRatio < 0.8) score -= 20;
  if (matchedSalesRatio < 0.5) score -= 20;

  if (matchedUnitsRatio < 0.8) score -= 15;
  if (matchedUnitsRatio < 0.5) score -= 15;

  if (summary.totalProfit < 0) score -= 35;
  if (summary.averageRoiPercent < 10 && summary.matchedSales > 0) score -= 15;
  if (summary.averageUnitProfit <= 0 && summary.matchedUnits > 0) score -= 15;

  if (score < 0) score = 0;

  final label = score >= 80
      ? 'strong profit system'
      : score >= 55
          ? 'partial profit system'
          : 'weak profit system';

  final explanation = score >= 80
      ? 'Sales and units are mostly matched, with healthy profit structure.'
      : score >= 55
          ? 'Profit tracking works, but unmatched sales/units or low ROI need review.'
          : 'Profit system needs cleanup: missing purchase links, weak returns, or bad unit economics.';

  return SalesProfitHealthModel(
    score: score,
    label: label,
    explanation: explanation,
  );
});