// lib/features/dashboard/application/dashboard_deep_metrics_model.dart

class DashboardDeepMetricsModel {
  final int alertsCount;
  final int staleCount;
  final int bestDealsCount;
  final double topExpectedProfit;
  final int totalSoldCount;
  final int totalActiveCount;

  const DashboardDeepMetricsModel({
    required this.alertsCount,
    required this.staleCount,
    required this.bestDealsCount,
    required this.topExpectedProfit,
    required this.totalSoldCount,
    required this.totalActiveCount,
  });
}
