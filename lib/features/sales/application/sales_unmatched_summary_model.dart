class SalesUnmatchedSummaryModel {
  final int unmatchedCount;
  final int unmatchedUnits;
  final double unmatchedNet;
  final String label;

  const SalesUnmatchedSummaryModel({
    required this.unmatchedCount,
    required this.unmatchedUnits,
    required this.unmatchedNet,
    required this.label,
  });
}