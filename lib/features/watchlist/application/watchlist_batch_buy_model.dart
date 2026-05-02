class WatchlistBatchBuyModel {
  final int count;
  final double totalMaxCost;
  final double totalMarketCost;
  final double potentialProfit;

  const WatchlistBatchBuyModel({
    required this.count,
    required this.totalMaxCost,
    required this.totalMarketCost,
    required this.potentialProfit,
  });
}