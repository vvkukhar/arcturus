class AnalyticsRuleStackSummaryModel {
  final int enabledRules;
  final bool scheduleEnabled;
  final String frequency;
  final String label;

  const AnalyticsRuleStackSummaryModel({
    required this.enabledRules,
    required this.scheduleEnabled,
    required this.frequency,
    required this.label,
  });
}