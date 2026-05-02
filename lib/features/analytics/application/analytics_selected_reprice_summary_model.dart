class AnalyticsSelectedRepriceSummaryModel {
  final int count;
  final double currentTotal;
  final double suggestedTotal;
  final double delta;

  const AnalyticsSelectedRepriceSummaryModel({
    required this.count,
    required this.currentTotal,
    required this.suggestedTotal,
    required this.delta,
  });
}
