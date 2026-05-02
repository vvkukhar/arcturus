class MarketTrendModel {
  final String itemRef;
  final double latestAverage;
  final double previousAverage;
  final double delta;

  const MarketTrendModel({
    required this.itemRef,
    required this.latestAverage,
    required this.previousAverage,
    required this.delta,
  });
}
