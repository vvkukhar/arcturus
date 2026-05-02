class AnalyticsRuleScheduleModel {
  final bool enabled;
  final String frequencyLabel;

  const AnalyticsRuleScheduleModel({
    required this.enabled,
    required this.frequencyLabel,
  });

  AnalyticsRuleScheduleModel copyWith({
    bool? enabled,
    String? frequencyLabel,
  }) {
    return AnalyticsRuleScheduleModel(
      enabled: enabled ?? this.enabled,
      frequencyLabel: frequencyLabel ?? this.frequencyLabel,
    );
  }
}
