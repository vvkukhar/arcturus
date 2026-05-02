class InventoryDangerSummaryModel {
  final int lowProfitCount;
  final int highRiskCount;
  final int bothCount;

  const InventoryDangerSummaryModel({
    required this.lowProfitCount,
    required this.highRiskCount,
    required this.bothCount,
  });
}
