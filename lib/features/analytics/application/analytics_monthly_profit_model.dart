class AnalyticsMonthlyProfitModel {
  final String label;
  final double revenue;
  final double netProfit;
  final int salesCount;

  const AnalyticsMonthlyProfitModel({
    required this.label,
    required this.revenue,
    required this.netProfit,
    required this.salesCount,
  });
}