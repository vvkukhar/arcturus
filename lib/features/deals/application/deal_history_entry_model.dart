class DealHistoryEntryModel {
  final String id;
  final String title;
  final double askingPrice;
  final double marketPrice;
  final double expectedProfit;
  final double marginPercent;
  final String verdict;
  final DateTime createdAt;

  const DealHistoryEntryModel({
    required this.id,
    required this.title,
    required this.askingPrice,
    required this.marketPrice,
    required this.expectedProfit,
    required this.marginPercent,
    required this.verdict,
    required this.createdAt,
  });
}
