class WatchlistQueueAffordabilitySummaryModel {
  final String label;
  final double remainingCash;
  final bool enoughCash;

  const WatchlistQueueAffordabilitySummaryModel({
    required this.label,
    required this.remainingCash,
    required this.enoughCash,
  });
}