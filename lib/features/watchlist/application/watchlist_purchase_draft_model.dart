class WatchlistPurchaseDraftModel {
  final String title;
  final String? refId;
  final String? theme;
  final int quantity;
  final double buyPrice;
  final double estimatedValue;
  final String? note;

  const WatchlistPurchaseDraftModel({
    required this.title,
    required this.refId,
    required this.theme,
    required this.quantity,
    required this.buyPrice,
    required this.estimatedValue,
    required this.note,
  });

  double get estimatedSpread => estimatedValue - buyPrice;
}