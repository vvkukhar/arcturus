class AnalyticsAutomationMaturityModel {
  final String label;
  final int enabledRules;
  final bool scheduleEnabled;
  final int totalRuns;

  const AnalyticsAutomationMaturityModel({
    required this.label,
    required this.enabledRules,
    required this.scheduleEnabled,
    required this.totalRuns,
  });
}
