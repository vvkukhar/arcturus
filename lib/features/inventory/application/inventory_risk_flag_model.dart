class InventoryRiskFlagModel {
  final String itemId;
  final bool lowProfit;
  final bool highRisk;
  final double expectedProfit;
  final int daysHeld;

  const InventoryRiskFlagModel({
    required this.itemId,
    required this.lowProfit,
    required this.highRisk,
    required this.expectedProfit,
    required this.daysHeld,
  });
}
