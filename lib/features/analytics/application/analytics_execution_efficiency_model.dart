class AnalyticsExecutionEfficiencyModel {
  final int totalRuns;
  final int totalAffected;
  final double avgAffectedPerRun;

  const AnalyticsExecutionEfficiencyModel({
    required this.totalRuns,
    required this.totalAffected,
    required this.avgAffectedPerRun,
  });
}
