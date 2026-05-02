class DealEvaluationModel {
  final String title;
  final double askingPrice;
  final double marketPrice;
  final double expectedProfit;
  final double marginPercent;
  final String verdict;

  const DealEvaluationModel({
    required this.title,
    required this.askingPrice,
    required this.marketPrice,
    required this.expectedProfit,
    required this.marginPercent,
    required this.verdict,
  });
}
