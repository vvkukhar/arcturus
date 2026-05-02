class InventoryInlinePriceSuggestionModel {
  final String itemId;
  final double currentExpected;
  final double suggestedPrice;
  final double delta;
  final bool hasSuggestion;

  const InventoryInlinePriceSuggestionModel({
    required this.itemId,
    required this.currentExpected,
    required this.suggestedPrice,
    required this.delta,
    required this.hasSuggestion,
  });
}
