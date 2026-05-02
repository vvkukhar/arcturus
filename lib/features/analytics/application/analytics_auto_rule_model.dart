class AnalyticsAutoRuleModel {
  final String id;
  final String title;
  final String description;
  final bool enabled;

  const AnalyticsAutoRuleModel({
    required this.id,
    required this.title,
    required this.description,
    required this.enabled,
  });

  AnalyticsAutoRuleModel copyWith({
    String? id,
    String? title,
    String? description,
    bool? enabled,
  }) {
    return AnalyticsAutoRuleModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      enabled: enabled ?? this.enabled,
    );
  }
}
