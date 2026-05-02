class GlobalSearchIntentStrengthModel {
  final String label;
  final int resultsCount;
  final int exactCount;

  const GlobalSearchIntentStrengthModel({
    required this.label,
    required this.resultsCount,
    required this.exactCount,
  });
}
