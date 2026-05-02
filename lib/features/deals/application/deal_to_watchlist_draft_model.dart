class DealToWatchlistDraftModel {
  final String title;
  final double desiredBuyPrice;
  final double maxBuyPrice;
  final double marketPrice;
  final String comment;

  const DealToWatchlistDraftModel({
    required this.title,
    required this.desiredBuyPrice,
    required this.maxBuyPrice,
    required this.marketPrice,
    required this.comment,
  });
}
