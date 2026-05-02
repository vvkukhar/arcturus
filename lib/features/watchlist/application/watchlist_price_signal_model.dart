class WatchlistPriceSignalModel {
  final String label;
  final double marketPrice;
  final double desiredBuyPrice;
  final double maxBuyPrice;
  final double desiredGap;
  final double maxGap;
  final bool underDesired;
  final bool underMax;

  const WatchlistPriceSignalModel({
    required this.label,
    required this.marketPrice,
    required this.desiredBuyPrice,
    required this.maxBuyPrice,
    required this.desiredGap,
    required this.maxGap,
    required this.underDesired,
    required this.underMax,
  });
}