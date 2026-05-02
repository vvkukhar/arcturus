// lib/features/analytics/application/analytics_profit_summary_model.dart
class AnalyticsProfitSummaryModel {
  final double totalCost;
  final double totalExpectedRevenue;
  final double totalExpectedProfit;
  final double roiPercent;

  const AnalyticsProfitSummaryModel({
    required this.totalCost,
    required this.totalExpectedRevenue,
    required this.totalExpectedProfit,
    required this.roiPercent,
  });
}
