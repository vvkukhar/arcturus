class WatchlistAutoBuyCashCompareModel {
  final double totalSpend;
  final double availableCash;
  final double remainingCash;
  final bool enoughCash;

  const WatchlistAutoBuyCashCompareModel({
    required this.totalSpend,
    required this.availableCash,
    required this.remainingCash,
    required this.enoughCash,
  });
}