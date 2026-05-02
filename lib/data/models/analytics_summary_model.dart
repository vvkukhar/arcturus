// lib/data/models/analytics_summary_model.dart

class AnalyticsSummaryModel {
  final double totalInvested;
  final double totalSoldRevenue;
  final double totalNetProfit;
  final double averageRoi;
  final double averageMargin;
  final double frozenCapital;
  final double inventoryValue;
  final int soldCount;
  final int activeCount;
  final int deadStockCount;
  final double averageDaysToSell;

  const AnalyticsSummaryModel({
    required this.totalInvested,
    required this.totalSoldRevenue,
    required this.totalNetProfit,
    required this.averageRoi,
    required this.averageMargin,
    required this.frozenCapital,
    required this.inventoryValue,
    required this.soldCount,
    required this.activeCount,
    required this.deadStockCount,
    required this.averageDaysToSell,
  });
}
