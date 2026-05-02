// lib/features/analytics/application/market_inventory_reprice_suggestion_model.dart
class MarketInventoryRepriceSuggestionModel {
  final String itemId;
  final String title;
  final double currentExpected;
  final double marketAverage;
  final double suggestedPrice;

  const MarketInventoryRepriceSuggestionModel({
    required this.itemId,
    required this.title,
    required this.currentExpected,
    required this.marketAverage,
    required this.suggestedPrice,
  });
}
