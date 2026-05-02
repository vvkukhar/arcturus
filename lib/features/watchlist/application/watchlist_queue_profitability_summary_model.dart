class WatchlistQueueProfitabilitySummaryModel {
  final int total;
  final double estimatedBuyCost;
  final double estimatedMaxValue;
  final double estimatedProfitGap;

  const WatchlistQueueProfitabilitySummaryModel({
    required this.total,
    required this.estimatedBuyCost,
    required this.estimatedMaxValue,
    required this.estimatedProfitGap,
  });
}