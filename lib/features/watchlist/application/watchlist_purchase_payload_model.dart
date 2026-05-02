class WatchlistPurchasePayloadModel {
  final String title;
  final String source;
  final double suggestedPrice;
  final String note;

  const WatchlistPurchasePayloadModel({
    required this.title,
    required this.source,
    required this.suggestedPrice,
    required this.note,
  });
}
