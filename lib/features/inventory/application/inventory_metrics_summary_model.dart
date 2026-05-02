class InventoryMetricsSummaryModel {
  final int totalItems;
  final int trackedItems;
  final double totalCost;
  final double expectedRevenue;
  final double expectedProfit;

  const InventoryMetricsSummaryModel({
    required this.totalItems,
    required this.trackedItems,
    required this.totalCost,
    required this.expectedRevenue,
    required this.expectedProfit,
  });
}
