class AnalyticsRulePresetModel {
  final String id;
  final String title;
  final List<String> enabledRuleIds;

  const AnalyticsRulePresetModel({
    required this.id,
    required this.title,
    required this.enabledRuleIds,
  });

  static const presets = [
    AnalyticsRulePresetModel(
      id: 'balanced',
      title: 'Balanced',
      enabledRuleIds: ['market_98', 'old_stock_attention'],
    ),
    AnalyticsRulePresetModel(
      id: 'aggressive',
      title: 'Aggressive',
      enabledRuleIds: ['market_98', 'old_stock_attention', 'profit_priority'],
    ),
    AnalyticsRulePresetModel(
      id: 'minimal',
      title: 'Minimal',
      enabledRuleIds: ['old_stock_attention'],
    ),
  ];
}
