class AnalyticsAutoRuleHealthModel {
  final int enabledRules;
  final int disabledRules;
  final String label;

  const AnalyticsAutoRuleHealthModel({
    required this.enabledRules,
    required this.disabledRules,
    required this.label,
  });
}
