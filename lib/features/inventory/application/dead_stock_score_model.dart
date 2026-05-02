class DeadStockScoreModel {
  final String itemId;
  final String title;
  final int days;
  final double capital;
  final double expectedProfit;
  final double score;

  const DeadStockScoreModel({
    required this.itemId,
    required this.title,
    required this.days,
    required this.capital,
    required this.expectedProfit,
    required this.score,
  });
}
