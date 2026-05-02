class AnalyticsExecutionTotalsModel {
  final int manualRuns;
  final int scheduledRuns;
  final int totalRuns;
  final int totalAffectedItems;

  const AnalyticsExecutionTotalsModel({
    required this.manualRuns,
    required this.scheduledRuns,
    required this.totalRuns,
    required this.totalAffectedItems,
  });
}