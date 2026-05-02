class WatchlistPriorityBreakdownModel {
  final String id;
  final double activeBoost;
  final double spreadScore;
  final double valueGapScore;
  final double total;

  const WatchlistPriorityBreakdownModel({
    required this.id,
    required this.activeBoost,
    required this.spreadScore,
    required this.valueGapScore,
    required this.total,
  });
}