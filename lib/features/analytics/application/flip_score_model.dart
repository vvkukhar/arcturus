// lib/features/analytics/application/flip_score_model.dart

class FlipScoreModel {
  final String itemId;
  final String title;
  final double score;
  final double expectedProfit;
  final int daysInInventory;

  const FlipScoreModel({
    required this.itemId,
    required this.title,
    required this.score,
    required this.expectedProfit,
    required this.daysInInventory,
  });
}
