class MarketTrendDeepModel {
  final String itemTitle;
  final double low;
  final double average;
  final double high;
  final double spread;
  final int snapshots;

  const MarketTrendDeepModel({
    required this.itemTitle,
    required this.low,
    required this.average,
    required this.high,
    required this.spread,
    required this.snapshots,
  });
}