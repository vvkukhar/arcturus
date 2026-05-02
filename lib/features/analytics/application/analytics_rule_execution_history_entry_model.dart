class AnalyticsRuleExecutionHistoryEntryModel {
  final DateTime createdAt;
  final int repricedItems;
  final int highlightedOldStock;
  final bool profitPriorityEnabled;

  const AnalyticsRuleExecutionHistoryEntryModel({
    required this.createdAt,
    required this.repricedItems,
    required this.highlightedOldStock,
    required this.profitPriorityEnabled,
  });
}
