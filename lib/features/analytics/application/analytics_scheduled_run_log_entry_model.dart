class AnalyticsScheduledRunLogEntryModel {
  final DateTime createdAt;
  final String frequency;
  final int affectedItems;

  const AnalyticsScheduledRunLogEntryModel({
    required this.createdAt,
    required this.frequency,
    required this.affectedItems,
  });
}
