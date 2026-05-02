// lib/features/analytics/application/auto_price_suggestion_model.dart

class AutoPriceSuggestionModel {
  final String itemId;
  final String title;
  final double currentExpected;
  final double suggestedPrice;
  final double marketAverage;
  final String reason;

  const AutoPriceSuggestionModel({
    required this.itemId,
    required this.title,
    required this.currentExpected,
    required this.suggestedPrice,
    required this.marketAverage,
    required this.reason,
  });
}
