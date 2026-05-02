class ActivityGroupedDaySummaryModel {
  final String dateLabel;
  final int total;
  final int reports;
  final int purchases;
  final int sales;

  const ActivityGroupedDaySummaryModel({
    required this.dateLabel,
    required this.total,
    required this.reports,
    required this.purchases,
    required this.sales,
  });
}
